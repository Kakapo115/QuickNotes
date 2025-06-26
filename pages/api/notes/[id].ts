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
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { title, content },
    });
    return res.json(updatedNote);
  }

  if (req.method === "DELETE") {
    await prisma.note.delete({ where: { id: noteId } });
    return res.status(204).end();
  }

  res.status(405).end();
}
