import { Layout } from '@components'
import { AppProvider } from '@context'
import { CourseDetail, Home, NotFound } from '@pages'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses/:acronym" element={<CourseDetail />} />
            {/* <Route path="/feedback/new" element={<GiveFeedback />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AppProvider>
    </Router>
  )
}

export default App
