import { lazy, Suspense, createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import {
  DashboardLoader,
  GalleryLoader,
  AnalyticsLoader,
} from '../components/common/RouteLoaders'

// Lazy load page components
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Gallery = lazy(() => import('../pages/Gallery'))
const Analytics = lazy(() => import('../pages/Analytics'))

// Route configuration with lazy loading
export const routes: RouteObject[] = [
  {
    path: '/',
    element: createElement(
      Suspense,
      { fallback: createElement(DashboardLoader) },
      createElement(Dashboard)
    ),
  },
  {
    path: '/dashboard',
    element: createElement(
      Suspense,
      { fallback: createElement(DashboardLoader) },
      createElement(Dashboard)
    ),
  },
  {
    path: '/gallery',
    element: createElement(
      Suspense,
      { fallback: createElement(GalleryLoader) },
      createElement(Gallery)
    ),
  },
  {
    path: '/upload',
    element: createElement(
      Suspense,
      { fallback: createElement(DashboardLoader) },
      createElement(Dashboard)
    ),
  },
  {
    path: '/analytics',
    element: createElement(
      Suspense,
      { fallback: createElement(AnalyticsLoader) },
      createElement(Analytics)
    ),
  },
]
