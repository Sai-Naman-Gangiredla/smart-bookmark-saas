"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-blue-950 text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center">
        
        <h1 className="text-4xl font-bold mb-4">
          Smart Bookmark Manager
        </h1>

        <p className="text-gray-400 mb-8">
          Organize, manage and access your links with elegance and speed.
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition font-semibold text-lg"
        >
          Sign in with Google
        </button>

        <p className="text-gray-500 text-sm mt-6">
          Secure authentication powered by Supabase
        </p>
      </div>
    </main>
  );
}
