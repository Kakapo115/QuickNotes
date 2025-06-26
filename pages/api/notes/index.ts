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

  if (req.method === "GET") {
    const notes = await prisma.note.findMany({
      where: { userId: user.userId },
    });
    return res.json(notes);
  }

  if (req.method === "POST") {
    const { content } = req.body;

    const newNote = await prisma.note.create({
      data: {
        content,
        userId: user.userId,
      },
    });
    return res.status(201).json(newNote);
  }

  res.status(405).end();
}
