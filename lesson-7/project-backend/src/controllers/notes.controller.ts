import type { Request, Response } from "express";

import prisma from "../../db.ts";

import { AppError } from "../errors.ts";
import type {
  CreateNoteBody,
  NoteParams,
  NotesQuery,
  UpdateNoteBody,
} from "../validators/note.validator.ts";

export const getAllNotes = async (
  req: Request<{}, {}, {}, NotesQuery>,
  res: Response,
) => {
  const { search } = req.query;
  const notes = await prisma.note.findMany({
    where: search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: {
      title: "asc",
    },
    include: {
      category: true,
    },
  });

  res.json(notes);
};

export const getNoteById = async (
  req: Request<NoteParams>,
  res: Response,
) => {
  const { id } = req.params;
  const note = await prisma.note.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (!note) {
    throw new AppError(404, `Cannot find note with id=${id}`);
  }

  res.json(note);
};

export const addNote = async (
  req: Request<{}, {}, CreateNoteBody>,
  res: Response,
) => {
  const newNote = await prisma.note.create({
    data: req.body,
  });

  res.status(201).json(newNote);
};

export const updateNoteById = async (
  req: Request<NoteParams, {}, UpdateNoteBody>,
  res: Response,
) => {
  const { id } = req.params;
  const note = await prisma.note.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!note) {
    throw new AppError(404, `Cannot find note with id=${id}`);
  }

  const updatedNote = await prisma.note.update({
    where: {
      id,
    },
    data: req.body,
  });

  res.json(updatedNote);
};

export const deleteNoteById = async (
  req: Request<NoteParams>,
  res: Response,
) => {
  const { id } = req.params;
  const note = await prisma.note.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!note) {
    throw new AppError(404, `Cannot find note with id=${id}`);
  }

  const deletedNote = await prisma.note.delete({
    where: {
      id,
    },
  });

  res.json(deletedNote);
};
