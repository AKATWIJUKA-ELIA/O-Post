import ForgotPassword from "@/components/ForgotPassword/page"
import { AuthShell } from "@/components/auth/auth-shell"

export default function Page() {
  return (
    <AuthShell>
      <ForgotPassword />
    </AuthShell>
  )
}
