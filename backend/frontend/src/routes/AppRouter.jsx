import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AuthLayout from '../layouts/AuthLayout'
import { PageLoader } from '../components/Loader'

// Lazy-load all pages to improve initial bundle size
const Home = lazy(() => import('../pages/Home'))
const Login = lazy(() => import('../pages/Login'))
const Signup = lazy(() => import('../pages/Signup'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const StartupForm = lazy(() => import('../pages/StartupForm'))
const BusinessPlan = lazy(() => import('../pages/BusinessPlan'))
const Branding = lazy(() => import('../pages/Branding'))
const WebsitePreview = lazy(() => import('../pages/WebsitePreview'))
const Marketing = lazy(() => import('../pages/Marketing'))
const Finance = lazy(() => import('../pages/Finance'))
const Compliance = lazy(() => import('../pages/Compliance'))
const PitchDeck = lazy(() => import('../pages/PitchDeck'))
const History = lazy(() => import('../pages/History'))
const Profile = lazy(() => import('../pages/Profile'))
const Settings = lazy(() => import('../pages/Settings'))
const NotFound = lazy(() => import('../pages/NotFound'))

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route index path={ROUTES.HOME} element={<Home />} />
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
          </Route>

          {/* Protected dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.NEW} element={<StartupForm />} />
            <Route path={ROUTES.BUSINESS_PLAN} element={<BusinessPlan />} />
            <Route path={ROUTES.BRANDING} element={<Branding />} />
            <Route path={ROUTES.WEBSITE} element={<WebsitePreview />} />
            <Route path={ROUTES.MARKETING} element={<Marketing />} />
            <Route path={ROUTES.FINANCE} element={<Finance />} />
            <Route path={ROUTES.COMPLIANCE} element={<Compliance />} />
            <Route path={ROUTES.PITCH_DECK} element={<PitchDeck />} />
            <Route path={ROUTES.HISTORY} element={<History />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
