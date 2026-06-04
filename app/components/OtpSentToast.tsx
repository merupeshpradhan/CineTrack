"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function OtpSentToast() {
  // Display success notification when the component mounts
  useEffect(() => {
    toast.success("OTP sent successfully! Check your email.");
  }, []);

  return null;
}
