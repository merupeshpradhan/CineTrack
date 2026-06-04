"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  // Global toast notification provider
  return <Toaster position="top-right" reverseOrder={false} />;
}
