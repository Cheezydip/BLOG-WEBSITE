import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import BlogListPage from './pages/BlogListPage'
import BlogDetailPage from './pages/BlogDetailPage'
import NewBlogPage from './pages/NewBlogPage'
import './index.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/new" element={<NewBlogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App