// import {
//   CourseCombobox,
//   ReviewSubmittedMessage,
//   StarRatingWithLabel
// } from '@components'
// import { formatSchoolYearString, getCurrentSchoolYear } from '@lib/schoolYear'
// import { getCourses, submitFeedback } from '@services/meicFeedbackAPI'
// import {
//   Button,
//   Input,
//   Label,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   Textarea
// } from '@ui'
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger
// } from '@ui/tooltip'
// import { motion } from 'framer-motion'
// import { HelpCircle, Send } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { useNavigate, useSearchParams } from 'react-router-dom'
// import { Course } from '../services/meicFeedbackAPI'
import { StarRatingWithLabel } from '@/components/StarRatingWithLabel'
import { Course, getCourses } from '@/services/meicFeedbackAPI'
import { MarkdownTextarea } from '@components'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatSchoolYearString, getCurrentSchoolYear } from '@lib/schoolYear'
import {
  Button,
  Checkbox,
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
  SelectValue
} from '@ui'
import { cn } from '@utils'
import { motion } from 'framer-motion'
import { Check, ChevronsUpDown, Send } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  schoolYear: z.number().min(2020).max(3050),
  courseId: z.number().min(0),
  rating: z.number().min(0).max(5),
  workloadRating: z.number().min(0).max(5),
  comment: z.string().min(0).max(1000).optional(),
  confirm: z.boolean().refine((val) => val, {
    message: 'You must check this box to submit your review'
  })
})

export function GiveReview() {
  const schoolYears = useMemo(
    () => Array.from({ length: 5 }, (_, i) => getCurrentSchoolYear() - i),
    []
  )

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
      comment: initialValues.comment,
      confirm: false
    }
  })

  const selectedCourse = form.watch('courseId')
  const selectedSchoolYear = form.watch('schoolYear')

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Store email in local storage
    localStorage.setItem('lastFeedbackEmail', values.email)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  // Fetch courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses()
        setCourses(coursesData)
      } catch (err) {
        console.error(err)
        // setError(err instanceof Error ? err.message : 'Failed to load data')
      }
    }

    fetchData()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Leave your Review
          </h1>
          {/* <Markdown>
            Thank you for taking the time to leave your review on a MEIC course!
            To ensure we have quality reviews on the website, we review every
            comment, one by one, before posting them.
          </Markdown> */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
              <div className="flex gap-2">
                <FormField
                  name="schoolYear"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Year</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select a school year" />
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
                      {/* <FormDescription>
                      We'll never share your email with anyone.
                    </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="courseId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-grow">
                      <FormLabel>Course</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-[200px] justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? courses.find((c) => c.id === field.value)
                                    ?.acronym
                                : 'Select course'}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
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
                                    onSelect={() => {
                                      form.setValue('courseId', c.id)
                                    }}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
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
              </div>
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
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="">
                      <FormLabel>
                        I confirm that I had{' '}
                        {courses.find((c) => c.id === selectedCourse)
                          ?.acronym ?? 'this course'}{' '}
                        in{' '}
                        {formatSchoolYearString(selectedSchoolYear, {
                          yearFormat: 'long'
                        })}
                        .
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {/* <Button type="submit"> */}
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit</span>
                </>
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </main>
  )
}

// export function GiveReview() {
//   const [courses, setCourses] = useState<Course[]>([])
//   const [searchParams] = useSearchParams()
//   const [isSuccess, setIsSuccess] = useState(false)
//   const navigate = useNavigate()

//   // Generate last 5 school years
//   const schoolYears = Array.from(
//     { length: 5 },
//     (_, i) => getCurrentSchoolYear() - i
//   )

//   // Get initial values from search params
//   const initialValues = getInitialValues(searchParams, schoolYears)

//   // Form fields
//   const [email,               setEmail]               = useState<string>(initialValues.email ?? '') // prettier-ignore
//   const [schoolYear,          setSchoolYear]          = useState<number>(initialValues.schoolYear ?? getCurrentSchoolYear()) // prettier-ignore
//   const [selectedCourseId,    setSelectedCourseId]    = useState<number>(initialValues.courseId ?? 0) // prettier-ignore
//   const [rating,              setRating]              = useState<number>(0) // prettier-ignore
//   const [hoverRating,         setHoverRating]         = useState<number | null>(null) // prettier-ignore
//   const [workloadRating,      setWorkloadRating]      = useState<number>(initialValues.workloadRating ?? 0) // prettier-ignore
//   const [hoverWorkloadRating, setHoverWorkloadRating] = useState<number | null>(null) // prettier-ignore
//   const [comment,             setComment]             = useState<string>(initialValues.comment ?? '') // prettier-ignore

//   // Form state
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState('')

//   // Fetch courses
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const coursesData = await getCourses()
//         setCourses(coursesData)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load data')
//       }
//     }

//     fetchData()
//   }, [])

//   // Validate course selection
//   useEffect(() => {
//     if (
//       selectedCourseId &&
//       courses.length > 0 &&
//       !courses.some((c: Course) => c.id === selectedCourseId)
//     ) {
//       setSelectedCourseId(0)
//     }
//   }, [selectedCourseId, courses])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!selectedCourseId) {
//       setError('Please select a course')
//       return
//     }

//     if (!schoolYear) {
//       setError('Please select a school year')
//       return
//     }

//     if (!rating) {
//       setError('Please select a rating')
//       return
//     }

//     if (!email) {
//       setError('Please enter your email')
//       return
//     }

//     if (!workloadRating) {
//       setError('Please select a workload rating')
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       await submitFeedback({
//         email,
//         schoolYear,
//         courseId: selectedCourseId,
//         rating,
//         workloadRating,
//         comment
//       })
//       setIsSuccess(true)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to submit review')
//     }

//     setIsSubmitting(false)
//   }

//   const resetForm = () => {
//     // Intentionally not resetting email and school year
//     // because most likely they will be the same

//     setSelectedCourseId(0)
//     setRating(0)
//     setHoverRating(null)
//     setWorkloadRating(0)
//     setComment('')
//   }

//   const handleNewReview = () => {
//     setIsSuccess(false)
//     resetForm()
//   }

//   if (isSuccess) {
//     return (
//       <ReviewSubmittedMessage
//         onNewReview={handleNewReview}
//         onBackToCourses={() => navigate('/')}
//       />
//     )
//   }

//   return (
//     <main className="container mx-auto px-4 py-8 max-w-2xl">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Leave your Review
//           </h1>
//           {/* <Markdown>
//             Thank you for taking the time to leave your review on a MEIC course!
//             To ensure we have quality reviews on the website, we review every
//             comment, one by one, before posting them.
//           </Markdown> */}

//           <form onSubmit={handleSubmit} className="space-y-8 mt-8">
//             <div>
//               <div className="flex items-center gap-2">
//                 <Label htmlFor="email" className="mb-2">
//                   Email
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <button
//                           type="button"
//                           tabIndex={0}
//                           aria-label="Email info"
//                         >
//                           <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
//                         </button>
//                       </TooltipTrigger>
//                       <TooltipContent side="right" className="max-w-xs text-sm">
//                         We ask for your email in case we need to get back to you
//                         regarding your review.
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
//                 </Label>
//               </div>
//               <Input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                   setEmail(e.target.value)
//                 }
//                 placeholder="your.email@example.com"
//                 required
//                 autoComplete="email"
//                 disabled={isSubmitting}
//                 aria-describedby="email-helper"
//               />
//               <div id="email-helper" className="text-xs text-gray-500 mt-1">
//                 We'll never share your email with anyone.
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg flex gap-4 items-end">
//               <div className="flex-none w-36">
//                 <Label htmlFor="schoolYear" className="mb-2">
//                   School Year
//                 </Label>
//                 <Select
//                   value={schoolYear.toString()}
//                   onValueChange={(val: string) => setSchoolYear(Number(val))}
//                   disabled={isSubmitting}
//                 >
//                   <SelectTrigger id="schoolYear" className="bg-white">
//                     <SelectValue placeholder="Select a school year" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {schoolYears.map((year) => (
//                       <SelectItem key={year} value={year.toString()}>
//                         {formatSchoolYearString(year, { yearFormat: 'long' })}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex-1">
//                 <Label htmlFor="course" className="mb-2">
//                   Course
//                 </Label>
//                 <CourseCombobox
//                   courses={courses}
//                   value={selectedCourseId || undefined}
//                   onChange={setSelectedCourseId}
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <Label className="mb-2">Overall Rating</Label>
//                 <StarRatingWithLabel
//                   value={rating}
//                   hoverValue={hoverRating}
//                   onChange={setRating}
//                   onHover={setHoverRating}
//                   size="lg"
//                 />
//               </div>

//               <div>
//                 <Label className="mb-2">Workload Rating</Label>
//                 <StarRatingWithLabel
//                   value={workloadRating}
//                   hoverValue={hoverWorkloadRating}
//                   onChange={setWorkloadRating}
//                   onHover={setHoverWorkloadRating}
//                   size="lg"
//                   labels={[
//                     'No work-life balance possible',
//                     'Difficult to balance with other courses',
//                     'Balanced with other commitments',
//                     'Easy to balance with other courses',
//                     'Barely impacted my schedule'
//                   ]}
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="comment" className="mb-2">
//                 Your Comments (optional)
//               </Label>
//               <Textarea
//                 id="comment"
//                 value={comment}
//                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
//                   setComment(e.target.value)
//                 }
//                 placeholder="Share your experience with this course..."
//                 disabled={isSubmitting}
//                 rows={5}
//               />
//             </div>

//             {error && (
//               <div
//                 className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm"
//                 aria-live="polite"
//               >
//                 {error}
//               </div>
//             )}

//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full flex items-center justify-center gap-2"
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg
//                     className="animate-spin h-4 w-4 mr-2 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8z"
//                     ></path>
//                   </svg>
//                   <span>Submitting...</span>
//                 </>
//               ) : (
//                 <>
//                   <Send className="h-4 w-4" />
//                   <span>Submit</span>
//                 </>
//               )}
//             </Button>
//           </form>
//         </div>
//       </motion.div>
//     </main>
//   )
// }

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
  const comment =
    decodeURIComponent(searchParams.get('comment') || '') || undefined

  return {
    email,
    schoolYear,
    courseId,
    rating,
    workloadRating,
    comment
  }
}
