import { InvalidArgumentError, program } from "commander";

import {
  readNotes,
  createNote,
  updateNoteById,
  deleteNoteById,
} from "./notes-repository.js";

const parseId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new InvalidArgumentError("ID must be a positive integer");
  }

  return id;
};

program
  .name("notes-cli")
  .description("CLI для роботи з нотатками")
  .version("1.0.0");

program
  .command("list")
  .description("Вивести всі нотатки")
  .action(async () => {
    const allNotes = await readNotes();
    console.table(allNotes);
  });

program
  .command("create")
  .description("Додати нотатку")
  .argument("<title>", "Заголовок нотатки")
  .argument("<content>", "Вміст нотатки")
  .action(async (title, content) => {
    if (!title || !content) {
      throw new Error("Missing title or content");
    }
    const newNote = await createNote({ title, content });
    console.log(newNote);
  });

program
  .command("update")
  .description("Оновити нотатку по id")
  .argument("<id>", "Заголовок нотатки", parseId)
  .argument("<title>", "Заголовок нотатки")
  .argument("<content>", "Вміст нотатки")
  .action(async (id, title, content) => {
    if (!title || !content) {
      throw new Error("Missing title or content");
    }
    const updateNote = await updateNoteById({
      id,
      title,
      content,
    });
    if (!updateNote) {
      throw new Error(`Cannot find note with id=${id}`);
    }
    console.log(updateNote);
  });

program
  .command("delete")
  .description("Видалити нотатку по id")
  .argument("<id>", "Заголовок нотатки", parseId)
  .action(async (id) => {
    const deleteNote = await deleteNoteById(id);
    if (!deleteNote) {
      throw new Error(`Cannot find note with id=${id}`);
    }
    console.log(deleteNote);
  });

program.parse();
