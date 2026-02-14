"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
  position: number;
  is_deleted: boolean;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const channelRef = useRef<any>(null);

  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("manual");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ---------- FETCH ----------
  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .order("position", { ascending: true });

    if (data) setBookmarks(data);
  };

  // ---------- INIT + REALTIME ----------
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);
      await fetchBookmarks(session.user.id);

      // Remove old channel if exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      // Create realtime subscription
      channelRef.current = supabase
        .channel(`bookmarks-${session.user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${session.user.id}`,
          },
          () => {
            fetchBookmarks(session.user.id);
          }
        )
        .subscribe();
    };

    init();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // ---------- ADD ----------
  const addBookmark = async () => {
    if (!url) return alert("URL is required");

    setActionLoading(true);

    const finalTitle =
      title || new URL(url).hostname.replace("www.", "");

    await supabase.from("bookmarks").insert([
      {
        title: finalTitle,
        url,
        user_id: user.id,
        position: bookmarks.length,
        is_deleted: false,
      },
    ]);

    setTitle("");
    setUrl("");
    setActionLoading(false);
  };

  // ---------- DELETE ----------
  const deleteBookmark = async (id: string) => {
    await supabase
      .from("bookmarks")
      .update({ is_deleted: true })
      .eq("id", id);
  };

  // ---------- EDIT ----------
  const startEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    await supabase
      .from("bookmarks")
      .update({ title: editTitle, url: editUrl })
      .eq("id", editingId);

    setEditingId(null);
  };

  // ---------- COPY ----------
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // ---------- DRAG ----------
  const onDragEnd = async (result: any) => {
    if (!result.destination || sortBy !== "manual") return;

    const reordered = Array.from(bookmarks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setBookmarks(reordered);

    await Promise.all(
      reordered.map((bookmark, index) =>
        supabase
          .from("bookmarks")
          .update({ position: index })
          .eq("id", bookmark.id)
      )
    );
  };

  // ---------- SORT ----------
  const sortedBookmarks =
    sortBy === "manual"
      ? [...bookmarks]
      : [...bookmarks].sort((a, b) => {
          if (sortBy === "newest")
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          if (sortBy === "oldest")
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          if (sortBy === "az") return a.title.localeCompare(b.title);
          if (sortBy === "za") return b.title.localeCompare(a.title);
          return 0;
        });

  const filteredBookmarks = sortedBookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.url.toLowerCase().includes(search.toLowerCase())
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#050816] to-[#0a0f2c] text-white px-6 py-10">

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Smart Bookmark Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Organize, manage and access your links with ease.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/trash")}
            className="px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition"
          >
            Trash
          </button>

          <button
            onClick={signOut}
            className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Add Section */}
      <div className="max-w-5xl mx-auto mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 flex gap-4">
        <input
          placeholder="Bookmark title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-white/10 border border-white/10"
        />
        <input
          placeholder="Bookmark URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-white/10 border border-white/10"
        />
        <button
          onClick={addBookmark}
          disabled={actionLoading}
          className="px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition"
        >
          {actionLoading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Search + Sort */}
      <div className="max-w-5xl mx-auto flex gap-4 mb-8">
        <input
          placeholder="Search bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-white/10 border border-white/10"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 rounded-xl bg-white/10 border border-white/10"
        >
          <option value="manual">Manual (Drag)</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">Title A-Z</option>
          <option value="za">Title Z-A</option>
        </select>
      </div>

      {/* List */}
      <div className="max-w-5xl mx-auto space-y-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="bookmarks">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {filteredBookmarks.map((bookmark, index) => (
                  <Draggable
                    key={bookmark.id}
                    draggableId={bookmark.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="group p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition flex justify-between items-center"
                      >
                        {editingId === bookmark.id ? (
                          <div className="flex-1 flex gap-3">
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="flex-1 p-2 rounded bg-white/10"
                            />
                            <input
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              className="flex-1 p-2 rounded bg-white/10"
                            />
                            <button onClick={saveEdit} className="text-green-400">
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${bookmark.url}`}
                                className="w-5 h-5"
                              />
                              <div>
                                <h2 className="font-semibold text-lg">
                                  {bookmark.title}
                                </h2>
                                <a
                                  href={bookmark.url}
                                  target="_blank"
                                  className="text-indigo-400 text-sm"
                                >
                                  {bookmark.url}
                                </a>
                              </div>
                            </div>

                            <div className="flex gap-5 text-sm opacity-0 group-hover:opacity-100 transition">
                              <button
                                onClick={() => copyToClipboard(bookmark.url)}
                                className="text-yellow-400 hover:underline"
                              >
                                Copy
                              </button>
                              <button
                                onClick={() => startEdit(bookmark)}
                                className="text-blue-400 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteBookmark(bookmark.id)}
                                className="text-red-400 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </main>
  );
}
