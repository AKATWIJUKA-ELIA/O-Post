import ChangePassword from "@/components/ChangePassword/page"
import { AuthShell } from "@/components/auth/auth-shell"

export default function Page() {
  return (
    <AuthShell>
      <ChangePassword />
    </AuthShell>
  )
}
