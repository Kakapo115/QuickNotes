"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: number;
  email?: string;
  iat: number;
  exp: number;
}

interface Note {
  id: number;
  title?: string;
  content: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      console.warn("Not logged in");
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      setNotes(data);
    } else if (Array.isArray(data.notes)) {
      setNotes(data.notes);
    } else {
      console.error("Unexpected notes format:", data);
      setNotes([]);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserEmail(decoded.email || "Logged in");
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    fetchNotes();
  }, [router, fetchNotes]);

  const createNote = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({ title: "Note", content: newNote }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setNewNote("");
      fetchNotes();
    }
  };

  const deleteNote = async (id: number) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchNotes();
  };

  const updateNote = async (id: number, content: string) => {
    const token = localStorage.getItem("token");
    const newContent = prompt("Update your note:", content);
    if (!newContent) return;

    await fetch(`/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: "Updated", content: newContent }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    fetchNotes();
  };

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700">Logged in as: {userEmail}</span>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
        >
          Logout
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border p-2"
          placeholder="Write a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button
          className="bg-green-500 text-white p-2 rounded"
          onClick={createNote}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li
            key={note.id}
            className="bg-white shadow p-3 rounded border text-black flex justify-between items-center"
          >
            <span className="flex-1">{note.content}</span>
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => updateNote(note.id, note.content)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
