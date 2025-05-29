import { Layout } from '@components'
import { AppProvider } from '@context'
import {
  CourseDetail,
  GiveReview,
  Home,
  NotFound,
  ShortcutRedirect
} from '@pages'
import { Toaster } from '@ui'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/feedback/new" element={<GiveReview />} />

            {/* Shortcut route for courses */}
            <Route path="/c/:degree/:course" element={<ShortcutRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </AppProvider>
    </Router>
  )
}

export default App
