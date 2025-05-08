import { OpenAPIRoute } from 'chanfana'
import { IRequest } from 'itty-router'

export class SubmitFeedback extends OpenAPIRoute {
  schema = {
    tags: ['Feedback'],
    summary: 'Submit feedback about a course',
    description: 'Submit feedback about a course',
    responses: {
      '302': {
        description: 'Redirect to feedback form'
      }
    }
  }

  async handle(request: IRequest, env: any, context: any) {
    try {
      // This is working!!
      // console.log('Creating posthog client with api key', {
      //   key: env.POSTHOG_API_KEY,
      //   host: env.POSTHOG_HOST
      // })
      // const posthog = new PostHog(env.POSTHOG_API_KEY, {
      //   host: env.POSTHOG_HOST
      // })

      // posthog.capture({
      //   distinctId: 'api.meic-feedback.afonsocrg.com',
      //   event: 'review_form_submit_test',
      //   properties: {
      //     timestamp: new Date().toISOString()
      //   }
      // })
      // posthog.shutdown()

      const feedbackFormUrl =
        'https://docs.google.com/forms/d/e/1FAIpQLSe3ptJwi8uyQfXI8DUmi03dwRL0m7GJa1bMU_6mJpobmXl8NQ/viewform?usp=header'
      return Response.json(
        {
          message: 'Redirecting to feedback form',
          url: feedbackFormUrl
        },
        { status: 302 }
      )
    } catch (error: unknown) {
      console.error('Error redirecting to feedback form:', error)
      return Response.json(
        {
          success: false,
          error: 'Failed to redirect to feedback form'
        },
        { status: 500 }
      )
    }
  }
}
