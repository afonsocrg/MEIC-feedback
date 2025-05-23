import { fromIttyRouter } from 'chanfana'
import { cors, Router, withCookies } from 'itty-router'
import {
  GetCourse,
  GetCourseFeedback,
  GetCourses,
  SubmitFeedback
} from './courses'
import { GetSpecializations } from './specializations'

const { preflight, corsify } = cors({
  origin: ['http://localhost:5173', 'https://meic-feedback.afonsocrg.com'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

export const router = fromIttyRouter(
  Router({
    before: [preflight, withCookies],
    finally: [corsify]
  }),
  { docs_url: '/docs' }
)

// ---------------------------------------------------------
// Public routes
// ---------------------------------------------------------
router.get('/courses', GetCourses)
router.get('/courses/:id', GetCourse)
router.get('/courses/:id/feedback', GetCourseFeedback)
router.post('/courses/:id/feedback', SubmitFeedback)
router.get('/specializations', GetSpecializations)

// ---------------------------------------------------------
// Authenticated routes
// ---------------------------------------------------------

// router.all('*', authenticateUser)

// 404 for everything else
router.all('*', () =>
  Response.json(
    {
      success: false,
      error: 'Route not found'
    },
    { status: 404 }
  )
)
