import { Outlet } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const RootLayout = () => {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="page">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

export default RootLayout
