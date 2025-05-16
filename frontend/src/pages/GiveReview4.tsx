import { StarRatingWithLabel } from '@/components/StarRatingWithLabel'
import {
  Course,
  getCourses,
  MeicFeedbackAPIError
} from '@/services/meicFeedbackAPI'
import { MarkdownTextarea, ReviewSubmitSuccess } from '@components'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatSchoolYearString, getCurrentSchoolYear } from '@lib/schoolYear'
import { submitFeedback } from '@services/meicFeedbackAPI'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@ui'
import { cn } from '@utils'
import { motion } from 'framer-motion'
import { Check, ChevronDown, HelpCircle, Loader2, Send } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  schoolYear: z.number().min(2020).max(3050),
  courseId: z.number(),
  rating: z.number().min(0).max(5),
  workloadRating: z.number().min(0).max(5),
  comment: z.string().min(0).max(1000).optional()
  // confirm: z.boolean().refine((val) => val, {
  //   message: 'You must check this box to submit your review'
  // })
})

export function GiveReview() {
  const navigate = useNavigate()

  const schoolYears = useMemo(
    () => Array.from({ length: 5 }, (_, i) => getCurrentSchoolYear() - i),
    []
  )

  // Form
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState<Course[]>([])
  const initialValues = getInitialValues(searchParams, schoolYears)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialValues.email,
      schoolYear: initialValues.schoolYear,
      courseId: initialValues.courseId,
      rating: initialValues.rating,
      workloadRating: initialValues.workloadRating,
      comment: initialValues.comment
    }
  })
  const selectedCourse = form.watch('courseId')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Store email in local storage for next time
    localStorage.setItem('lastFeedbackEmail', values.email)

    // Check if courseId is a valid course
    if (!courses.some((c) => c.id === values.courseId)) {
      form.setError('courseId', {
        message: 'Please select a valid course'
      })
      return
    }

    setIsSubmitting(true)
    try {
      await submitFeedback({
        ...values
      })
      setIsSuccess(true)
      toast.success('Feedback submitted successfully')
    } catch (err) {
      if (err instanceof MeicFeedbackAPIError) {
        toast.error(err.message)
      } else {
        console.error(err)
        toast.error('Failed to submit feedback')
      }
    }

    setIsSubmitting(false)
  }

  // Fetch courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses()
        setCourses(coursesData)
      } catch (err) {
        if (err instanceof MeicFeedbackAPIError) {
          toast.error(err.message)
        } else {
          console.error(err)
          toast.error('Failed to load data')
        }
      }
    }

    fetchData()
  }, [])

  // Validate course selection
  useEffect(() => {
    if (
      selectedCourse &&
      courses.length > 0 &&
      !courses.some((c: Course) => c.id === selectedCourse)
    ) {
      form.setValue('courseId', 0)
    }
  }, [form, courses, selectedCourse])

  if (isSuccess) {
    return (
      <ReviewSubmitSuccess
        onNewReview={() => {
          setIsSuccess(false)
          form.reset()
        }}
        onBackToCourses={() => navigate('/')}
      />
    )
  }
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center gap-2 font-normal text-sm">
                <span>Your feedback for:</span>

                {/* Course Selector */}
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="font-bold underline flex items-center gap-1 px-0 bg-transparent border-none shadow-none focus:outline-none"
                            >
                              {courses.find((c) => c.id === field.value)
                                ?.acronym || 'Select course'}
                              <ChevronDown className="w-5 h-5 opacity-70" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search course..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No courses found.</CommandEmpty>
                                <CommandGroup>
                                  {courses.map((c) => (
                                    <CommandItem
                                      value={`${c.acronym}`}
                                      key={c.id}
                                      onSelect={() => field.onChange(c.id)}
                                    >
                                      {c.acronym} - {c.name}
                                      <Check
                                        className={cn(
                                          'ml-auto',
                                          c.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* School Year Selector */}
                <FormField
                  control={form.control}
                  name="schoolYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          defaultValue={field.value?.toString()}
                        >
                          <SelectTrigger className="font-bold underline flex items-center gap-1 px-0 bg-transparent border-none shadow-none focus:outline-none w-auto">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>School Years</SelectLabel>
                              {schoolYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {formatSchoolYearString(year, {
                                    yearFormat: 'long'
                                  })}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Rating</FormLabel>
                    <FormControl>
                      <StarRatingWithLabel
                        value={field.value}
                        onChange={field.onChange}
                        size="lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workloadRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workload Rating</FormLabel>
                    <FormControl>
                      <StarRatingWithLabel
                        value={field.value}
                        onChange={field.onChange}
                        size="lg"
                        labels={[
                          'No work-life balance possible',
                          'Difficult to balance with other courses',
                          'Balanced with other commitments',
                          'Easy to balance with other courses',
                          'Barely impacted my schedule'
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="comment"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tell us more about your experience...</FormLabel>
                    <FormControl>
                      <MarkdownTextarea
                        placeholder="Share your experience with this course..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      You can use Markdown to format your comment!!{' '}
                      <Link
                        to="https://www.markdownguide.org/basic-syntax/"
                        target="_blank"
                        className="underline text-istBlue hover:text-istBlue/80"
                      >
                        Learn more
                      </Link>
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <>
                        <span>Email</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                tabIndex={0}
                                aria-label="Email info"
                              >
                                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs text-sm"
                            >
                              We ask for your email in case we need to get back
                              to you regarding your review. Your feedback will
                              always be kept anonymous.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormDescription>
                      We'll never share your email with anyone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                <>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>Submit</span>
                    </>
                  )}
                </>
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </main>
  )
}

function getRatingValue(searchValue: string | null) {
  if (!searchValue) return undefined
  const value = Number(searchValue)
  if (isNaN(value)) return undefined
  return 1 <= value && value <= 5 ? value : undefined
}

function getInitialValues(
  searchParams: URLSearchParams,
  schoolYears: number[]
) {
  const email =
    searchParams.get('email') || localStorage.getItem('lastFeedbackEmail') || ''
  const schoolYear = (() => {
    const year = Number(searchParams.get('schoolYear'))
    return schoolYears.includes(year) ? year : getCurrentSchoolYear()
  })()
  const courseId = Number(searchParams.get('courseId')) || 0
  const rating = getRatingValue(searchParams.get('rating'))
  const workloadRating = getRatingValue(searchParams.get('workloadRating'))
  const comment = decodeURIComponent(searchParams.get('comment') || '')

  return {
    email,
    schoolYear,
    courseId,
    rating,
    workloadRating,
    comment
  }
}
