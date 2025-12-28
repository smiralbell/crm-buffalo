// This layout ensures that app/app/layout.tsx is NOT applied to /login
// By creating a layout.tsx here, we create a separate layout tree for /login
// This prevents Next.js from applying app/app/layout.tsx to /login routes

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simply return children without any wrapper
  // This creates a separate layout branch that prevents app/app/layout.tsx from being applied
  return <>{children}</>
}

