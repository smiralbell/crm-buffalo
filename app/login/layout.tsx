// CRITICAL: This layout creates a separate layout tree for /login
// This prevents app/app/layout.tsx from being applied to /login routes
// In Next.js App Router, layouts in subdirectories create separate branches

export const dynamic = 'force-dynamic'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Return children directly without any wrapper
  // This ensures /login has its own layout branch and does NOT inherit app/app/layout.tsx
  return <>{children}</>
}
