import { Providers } from '@components'
import {
  CourseDetail,
  GiveReview,
  Home,
  NotFound,
  ShortcutRedirect
} from '@pages'
import { getReviewPath } from '@utils/routes'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path={getReviewPath()} element={<GiveReview />} />

        {/* Shortcut route for courses */}
        <Route path="/c/:degree/:course" element={<ShortcutRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Providers>
  )
}

export default App
