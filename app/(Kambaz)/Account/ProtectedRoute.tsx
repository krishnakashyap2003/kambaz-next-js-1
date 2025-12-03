"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!currentUser || !currentUser._id) {
        router.push("/Account/Signin");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!currentUser || !currentUser._id) {
    return null;
  }

  return <>{children}</>;
}
