// app/admin/layout.tsx
import { Suspense } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#ff6b00] animate-spin rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de l'administration...</p>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  )
}