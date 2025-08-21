/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

// Preload utility for optimizing component loading

export const preloadComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>
) => {
  // Start preloading the component
  const promise = importFn()

  // Return a component that uses the preloaded promise
  return {
    promise,
    component: () => promise.then((module) => module.default),
  }
}

// Preload critical components for better UX
export const preloadCriticalComponents = () => {
  // Preload Dashboard when user hovers over navigation
  const preloadDashboard = () => import('../pages/Dashboard')

  // Preload Gallery when user hovers over navigation
  const preloadGallery = () => import('../pages/Gallery')

  return {
    preloadDashboard,
    preloadGallery,
  }
}

// Preload on navigation hover for better performance
export const setupPreloading = () => {
  const { preloadDashboard, preloadGallery } = preloadCriticalComponents()

  // Preload components on navigation hover
  const setupHoverPreload = () => {
    const dashboardLink = document.querySelector(
      '[href="/dashboard"], [href="/"]'
    )
    const galleryLink = document.querySelector('[href="/gallery"]')

    if (dashboardLink) {
      dashboardLink.addEventListener('mouseenter', preloadDashboard)
    }

    if (galleryLink) {
      galleryLink.addEventListener('mouseenter', preloadGallery)
    }
  }

  // Setup preloading when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHoverPreload)
  } else {
    setupHoverPreload()
  }
}
