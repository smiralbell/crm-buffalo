// This layout ensures that app/app/layout.tsx is NOT applied to /login
// By creating a layout.tsx here, we create a separate layout tree for /login
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simply return children without any wrapper
  // This prevents app/app/layout.tsx from being applied
  return <>{children}</>
}

