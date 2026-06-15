"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api-client";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const res = await fetchWithAuth("/api/profile");
        
        const resData = await res.json();

        if (!res.ok) {
          throw new Error(resData.error || "Failed to download your user profile.");
        }

        setData(resData);
      } catch (err: any) {
        console.error("Profile view processing error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  // 1. Loading Visual Fallback
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 animate-pulse">
          Loading profile parameters...
        </p>
      </div>
    );
  }

  // 2. Exception Visual Fallback
  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm dark:border-red-950/40 dark:bg-zinc-900">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {error || "Account context missing."}
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-xs font-semibold text-zinc-900 underline dark:text-zinc-50"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // 3. Fully Loaded Profile View Interface
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center space-x-3">
          <Link 
            href="/dashboard" 
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← Back
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <h1 className="text-sm font-bold tracking-tight">User Profile Registry</h1>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl p-8">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/20">
            <h2 className="text-base font-bold tracking-tight">Account Parameters</h2>
            <p className="text-xs text-zinc-400">Verified database structural dimensions.</p>
          </div>

          <div className="divide-y divide-zinc-100 px-6 dark:divide-zinc-800">
            <div className="flex items-center justify-between py-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Unique Account ID
              </span>
              <span className="font-mono text-xs bg-zinc-100 px-2.5 py-1 rounded-md dark:bg-zinc-800">
                {data.id}
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Email Address Vector
              </span>
              <span className="text-sm font-medium">{data.email}</span>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Registration Date
              </span>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {new Date(data.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
