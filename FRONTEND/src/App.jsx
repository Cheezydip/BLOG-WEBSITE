import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import BlogListPage from './pages/BlogListPage'
import BlogDetailPage from './pages/BlogDetailPage'
import NewBlogPage from './pages/NewBlogPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import EditBlogPage from './pages/EditBlogPage'
import './index.css'

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login page — standalone, no layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin dashboard — standalone, no layout */}
      <Route
        path="/admin"
        element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
      />

      {/* Edit blog — uses root layout */}
      <Route element={<RootLayout />}>
        <Route
          path="/admin/edit/:slug"
          element={<ProtectedRoute><EditBlogPage /></ProtectedRoute>}
        />
      </Route>

      {/* Public + protected routes that use the root layout */}
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route
          path="/new"
          element={<ProtectedRoute><NewBlogPage /></ProtectedRoute>}
        />
      </Route>
    </Routes>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App