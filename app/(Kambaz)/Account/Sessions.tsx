"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";
import { User } from "../types";

export default function Session({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user: User = await client.profile();
        dispatch(setCurrentUser(user));
      } catch (err: unknown) {
        dispatch(setCurrentUser(null));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}