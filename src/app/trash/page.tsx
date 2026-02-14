"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  favicon?: string;
};

export default function TrashPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("is_deleted", true);

    if (data) setBookmarks(data);
    setLoading(false);
  };

  const restoreBookmark = async (id: string) => {
    await supabase
      .from("bookmarks")
      .update({ is_deleted: false })
      .eq("id", id);

    fetchTrash();
  };

  const deleteForever = async (id: string) => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    fetchTrash();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-blue-950 text-white p-10">
      
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Trash</h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl"
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : bookmarks.length === 0 ? (
        <p className="text-gray-500">Trash is empty.</p>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 flex justify-between items-center shadow-xl"
            >
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      bookmark.favicon ||
                      `https://www.google.com/s2/favicons?domain=${bookmark.url}`
                    }
                    className="w-5 h-5"
                  />
                  <h2 className="font-semibold">{bookmark.title}</h2>
                </div>
                <p className="text-blue-400 text-sm mt-1">
                  {bookmark.url}
                </p>
              </div>

              <div className="flex gap-6">
                <button
                  onClick={() => restoreBookmark(bookmark.id)}
                  className="text-green-400 hover:text-green-300"
                >
                  Restore
                </button>

                <button
                  onClick={() => deleteForever(bookmark.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
