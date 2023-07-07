// ** React Imports
import { ReactNode, ReactElement, useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'
import { useSelector } from '@/store'
import { Spin } from 'antd'


interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}




const GuestGuard = ({ children, fallback }: GuestGuardProps) => {
  const { isAuthenticated } = useSelector((store) => store.auth)
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(true);

  useEffect(() => {
    const allowed = isAuthenticated;

    if (allowed) {
      router.push("/");
    }
    const timeoutId = setTimeout(() => {
      setShowAuth(false);
    }, 500);
    return () => {
      clearTimeout(timeoutId); // Cancel the timeout when the component is unmounted
    };
        // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);

  if (showAuth) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
          width: "100%",
        }}
      >
        <Spin spinning={true} />
      </div>
    );
  }
  return <> {children}
  </>;

}

export default GuestGuard