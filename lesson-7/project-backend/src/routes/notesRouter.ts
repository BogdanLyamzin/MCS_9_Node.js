import { Router } from "express";

import validateBody from "../middlewares/validateBody.ts";
import validateParams from "../middlewares/validateParams.ts";
import validateQuery from "../middlewares/validateQuery.ts";
import {
  CreateNoteSchema,
  NoteParamsSchema,
  NotesQuerySchema,
  UpdateNoteSchema,
} from "../validators/note.validator.ts";
import type {
  CreateNoteBody,
  NoteParams,
  NotesQuery,
  UpdateNoteBody,
} from "../validators/note.validator.ts";

import * as notesController from "../controllers/notes.controller.ts";

const notesRouter = Router();

notesRouter.get<{}, any, any, NotesQuery>(
  "/",
  validateQuery(NotesQuerySchema),
  notesController.getAllNotes,
);

notesRouter.get<NoteParams>(
  "/:id",
  validateParams(NoteParamsSchema),
  notesController.getNoteById,
);

notesRouter.post<{}, any, CreateNoteBody>(
  "/",
  validateBody(CreateNoteSchema),
  notesController.addNote,
);

notesRouter.put<NoteParams, any, UpdateNoteBody>(
  "/:id",
  validateParams(NoteParamsSchema),
  validateBody(UpdateNoteSchema),
  notesController.updateNoteById,
);

notesRouter.delete<NoteParams>(
  "/:id",
  validateParams(NoteParamsSchema),
  notesController.deleteNoteById,
);

export default notesRouter;
