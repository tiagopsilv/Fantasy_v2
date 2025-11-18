import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import CriarLigaPage from './pages/CriarLiga'
import EscalarTimePage from './pages/EscalarTime'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/criar-liga" replace />} />
        <Route path="/criar-liga" element={<CriarLigaPage />} />
        <Route path="/escalar-time" element={<EscalarTimePage />} />
        <Route path="*" element={<Navigate to="/criar-liga" replace />} />
      </Route>
    </Routes>
  )
}
