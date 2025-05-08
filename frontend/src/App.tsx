import { Layout } from '@components'
import { CourseDetail, Home, NotFound } from '@pages'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

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
