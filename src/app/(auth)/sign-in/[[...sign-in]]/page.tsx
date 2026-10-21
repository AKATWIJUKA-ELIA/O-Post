import LoginForm from "../components/login"
import { AuthShell } from "@/components/auth/auth-shell"

export default function Page() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  )
}
