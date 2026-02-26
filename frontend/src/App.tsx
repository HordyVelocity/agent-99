import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Page009 from './pages/page009/Page009'
import { Welcome } from './pages/Welcome'
import { Onboarding1 } from './pages/Onboarding1'
import { Onboarding2 } from './pages/Onboarding2'
import { PostAssessmentVideo } from './pages/PostAssessmentVideo'
import { Confirmation } from './pages/Confirmation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding-1" element={<Onboarding1 />} />
        <Route path="/onboarding-2" element={<Onboarding2 />} />
        <Route
          path="/assessment"
          element={
            <Layout activePage="009">
              <Page009 />
            </Layout>
          }
        />
        <Route path="/post-assessment-video" element={<PostAssessmentVideo />} />
        <Route
          path="/new-case"
          element={<div style={{ fontFamily: "'Montserrat', system-ui, sans-serif", padding: '2rem', textAlign: 'center', color: '#101213' }}>Redirecting to case form...</div>}
        />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
