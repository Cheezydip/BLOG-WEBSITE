import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const RootLayout = () => {
  const { pathname } = useLocation()
  const showChrome = pathname !== '/'

  return (
    <div className="app-shell">
      {showChrome && <SiteHeader />}
      <main className="page">
        <Outlet />
      </main>
      {showChrome && <SiteFooter />}
    </div>
  )
}

export default RootLayout
