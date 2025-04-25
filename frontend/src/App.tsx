import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import CourseDetail from './pages/CourseDetail'
// import GiveFeedback from './pages/GiveFeedback'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses/:acronym" element={<CourseDetail />} />
          {/* <Route path="/feedback/new" element={<GiveFeedback />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
