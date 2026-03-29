import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '../hooks/useAuth'

const HomePage = lazy(() => import('../pages/HomePage').then(({ HomePage }) => ({
  default: HomePage
})))
const InventoryPage = lazy(() => import('../pages/InventoryPage').then(({ InventoryPage }) => ({
  default: InventoryPage
})))
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage').then(({ ProductDetailPage }) => ({
  default: ProductDetailPage
})))
const AboutPage = lazy(() => import('../pages/AboutPage').then(({ AboutPage }) => ({
  default: AboutPage
})))
const ContactPage = lazy(() => import('../pages/ContactPage').then(({ ContactPage }) => ({
  default: ContactPage
})))
const AdminOverviewPage = lazy(() => import('../golfpanel/pages/AdminOverviewPage').then(({ AdminOverviewPage }) => ({
  default: AdminOverviewPage
})))
const AdminProductsPage = lazy(() => import('../golfpanel/pages/AdminProductsPage').then(({ AdminProductsPage }) => ({
  default: AdminProductsPage
})))
const AdminProductFormPage = lazy(() => import('../golfpanel/pages/AdminProductFormPage').then(({ AdminProductFormPage }) => ({
  default: AdminProductFormPage
})))
const AdminContentPage = lazy(() => import('../golfpanel/pages/AdminContentPage').then(({ AdminContentPage }) => ({
  default: AdminContentPage
})))
const AdminSettingsPage = lazy(() => import('../golfpanel/pages/AdminSettingsPage').then(({ AdminSettingsPage }) => ({
  default: AdminSettingsPage
})))
const AdminLoginPage = lazy(() => import('../golfpanel/pages/AdminLoginPage').then(({ AdminLoginPage }) => ({
  default: AdminLoginPage
})))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(({ NotFoundPage }) => ({
  default: NotFoundPage
})))
const UpdatePasswordPage = lazy(() => import('../golfpanel/pages/UpdatePasswordPage').then(({ UpdatePasswordPage }) => ({
  default: UpdatePasswordPage
})))

function AdminLoginRedirect() {
  const { session, loading } = useAuth()

  if (loading) {
    return null
  }

  if (session) {
    return <Navigate to="/golfpanel" replace />
  }

  return <AdminLoginPage />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<div>Loading home...</div>}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="inventory"
            element={
              <Suspense fallback={<div>Loading inventory...</div>}>
                <InventoryPage />
              </Suspense>
            }
          />
          <Route
            path="inventory/:slug"
            element={
              <Suspense fallback={<div>Loading product...</div>}>
                <ProductDetailPage />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<div>Loading about...</div>}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<div>Loading contact...</div>}>
                <ContactPage />
              </Suspense>
            }
          />
        </Route>

        <Route path="golfpanel/login" element={<AdminLoginRedirect />} />
        <Route path="update-password" element={<UpdatePasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="golfpanel"
            element={<AdminLayout />}
          >
            <Route
              index
              element={
                <Suspense fallback={<div>Loading admin overview...</div>}>
                  <AdminOverviewPage />
                </Suspense>
              }
            />
            <Route
              path="products"
              element={
                <Suspense fallback={<div>Loading products...</div>}>
                  <AdminProductsPage />
                </Suspense>
              }
            />
            <Route
              path="products/new"
              element={
                <Suspense fallback={<div>Loading form...</div>}>
                  <AdminProductFormPage />
                </Suspense>
              }
            />
            <Route
              path="products/:id/edit"
              element={
                <Suspense fallback={<div>Loading form...</div>}>
                  <AdminProductFormPage />
                </Suspense>
              }
            />
            <Route
              path="content"
              element={
                <Suspense fallback={<div>Loading content...</div>}>
                  <AdminContentPage />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<div>Loading settings...</div>}>
                  <AdminSettingsPage />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}