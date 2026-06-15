"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth, setAccessToken } from "@/lib/api-client";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Load the test list data securely using our intercepting utility
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await fetchWithAuth("/api/test");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to load authorized components", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAccessToken(null); // Wipe out RAM token tracking
      router.push("/login");
    } catch (err) {
      console.error("Logout routing execution failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Verifying session credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-lg font-bold tracking-tight">
          Security Center Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Logout Session
        </button>
      </nav>

      <main className="mx-auto max-w-4xl p-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold tracking-tight">
            Registered Database Members
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            This data table was loaded over HTTP using an optimized short-term
            Access Token pipeline.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800">
            {users.length === 0 ? (
              <p className="p-4 text-sm text-zinc-500">
                Database connected successfully, but no user accounts were found.
              </p>
            ) : (
              <table className="w-full text-left text-sm text-zinc-500 dark:text-zinc-400">
                <thead className="bg-zinc-50 text-xs uppercase text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                  <tr>
                    <th className="px-6 py-3">ID Reference</th>
                    <th className="px-6 py-3">Email Vector</th>
                    <th className="px-6 py-3 text-right">Actions</th> {/* ✅ FIXED: Header matching row structure */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="bg-white hover:bg-zinc-50/50 dark:bg-zinc-900 dark:hover:bg-zinc-800/30"
                    >
                      <td className="font-mono px-6 py-4 text-xs">{u.id}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4 text-right"> {/* ✅ FIXED: Staged link element container */}
                        <Link 
                          href="/profile" 
                          className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={async () => {
                const res = await fetchWithAuth("/api/test");
                const data = await res.json();
                console.log("Token Testing Diagnostic Payloads:", data);
              }}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Test Route Interceptors
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
