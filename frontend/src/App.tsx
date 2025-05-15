import { Layout } from '@components'
import { AppProvider } from '@context'
import { CourseDetail, GiveReview, Home, NotFound } from '@pages'
import { Toaster } from '@ui'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses/:acronym" element={<CourseDetail />} />
            <Route path="/give-review" element={<GiveReview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </AppProvider>
    </Router>
  )
}

export default App
