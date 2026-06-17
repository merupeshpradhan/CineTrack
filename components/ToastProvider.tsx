"use client";

// Import toast UI renderer
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  // Global toast notification provider
  // Responsible for displaying:
  // toast.success()
  // toast.error()
  // toast.loading()

  return (
    <Toaster
      // Show notifications at top-right
      position="top-right"
      // New notifications appear below old ones
      reverseOrder={false}
    />
  );
}
