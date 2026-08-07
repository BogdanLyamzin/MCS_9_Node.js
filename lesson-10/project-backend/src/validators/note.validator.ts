import { z } from "zod";

export const NoteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const CreateNoteSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(3).max(1000),
  categoryId: z.number().int().positive(),
});

export const UpdateNoteSchema = CreateNoteSchema;

export const NotesQuerySchema = z.object({
  search: z.string().min(1).optional(),
});

export type NoteParams = z.infer<typeof NoteParamsSchema>;
export type CreateNoteBody = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteBody = z.infer<typeof UpdateNoteSchema>;
export type NotesQuery = z.infer<typeof NotesQuerySchema>;
