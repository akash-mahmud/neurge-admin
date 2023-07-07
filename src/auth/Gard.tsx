import { ReactNode } from "react"
import AuthGuard from "./AuthenticateGard"
import GuestGuard from "./GuestGard"
type GuardProps = {
    authGuard: boolean
    guestGuard: boolean
    children: ReactNode
  }
const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
    if (guestGuard) {
      return <GuestGuard 
      fallback={<></>}
      >{children}</GuestGuard>
    } else if (!guestGuard && !authGuard) {
      return <>{children}</>
    } else {
      return <AuthGuard 
      fallback={<></>}
      >{children}</AuthGuard>
    }
  }

  export default Guard