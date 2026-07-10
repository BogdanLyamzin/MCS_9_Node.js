import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const notesPath = join(__dirname, "notes.json");

const updateNotes = (notes) => writeFile(notesPath, JSON.stringify(notes, null, 2));

export const readNotes = async () => {
  const data = await readFile(notesPath, "utf8");
  const notes = JSON.parse(data.replace(/^\uFEFF/, ""));

  if (!Array.isArray(notes)) {
    throw new Error("Notes storage must contain an array");
  }

  return notes;
};

export const createNote = async ({ title, content }) => {
  const notes = await readNotes();
  const maxId = notes.reduce((max, note) => Math.max(max, Number(note.id) || 0), 0);
  const newNote = {
    id: maxId + 1,
    title,
    content,
  };

  notes.push(newNote);
  await updateNotes(notes);

  return newNote;
};

export const updateNoteById = async ({ id, title, content }) => {
  const notes = await readNotes();
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return null;
  }

  notes[index] = { ...notes[index], title, content };
  await updateNotes(notes);

  return notes[index];
};

export const deleteNoteById = async (id) => {
  const notes = await readNotes();
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return null;
  }

  const [deletedNote] = notes.splice(index, 1);
  await updateNotes(notes);

  return deletedNote;
};
