"use client";

import LoginPage from "./login/page";
import HomePage from "./home/page";
import { useAuth } from "../../utils/auth-context";

export default function RootPage() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <HomePage /> : <LoginPage />;
}
