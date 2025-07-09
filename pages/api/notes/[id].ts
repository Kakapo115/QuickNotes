import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const noteId = parseInt(req.query.id as string);

  if (req.method === "PUT") {
    const { title, content } = req.body;
    const updatedNote = await prisma.note.updateMany({
      where: {
        id: noteId,
        userId: user.userId, // ensures user owns the note
      },
      data: { title, content },
    });

    // Optional: check if any row was actually updated
    if (updatedNote.count === 0) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this note" });
    }

    return res.json({ message: "Note updated" });
  }

  if (req.method === "DELETE") {
    const deletedNote = await prisma.note.deleteMany({
      where: {
        id: noteId,
        userId: user.userId, // ensures user owns the note
      },
    });

    if (deletedNote.count === 0) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this note" });
    }

    return res.status(204).end();
  }

  res.status(405).end();
}
