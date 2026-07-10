import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import {
  readNotes,
  createNote,
  updateNoteById,
  deleteNoteById,
} from "./notes-repository.js";

const validateId = (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID must be a positive integer");
  }

  return id;
};

const validateText = (value, fieldName) => {
  const text = value.trim();

  if (!text) {
    throw new Error(`${fieldName} cannot be empty`);
  }

  return text;
};

const errorHandler = (action, message = "Command failed") => async (...args) => {
  try {
    await action(...args);
  } catch (error) {
    console.error(`${message}: ${error.message}`);
    process.exit(1);
  }
};

yargs(hideBin(process.argv))
  .scriptName("notes-cli")
  .usage("Usage: $0 <command> [options]")
  .command(
    "list",
    "Show all notes",
    () => {},
    errorHandler(async () => {
      const notes = await readNotes();
      console.table(notes);
    }, "Cannot read notes"),
  )
  .command(
    "create <title> <content>",
    "Create a new note",
    (builder) => {
      builder
        .positional("title", {
          describe: "Note title",
          type: "string",
        })
        .positional("content", {
          describe: "Note content",
          type: "string",
        });
    },
    errorHandler(async ({ title, content }) => {
      const note = await createNote({
        title: validateText(title, "Title"),
        content: validateText(content, "Content"),
      });

      console.log("Created:", note);
    }, "Cannot create note"),
  )
  .command(
    "update <id> <title> <content>",
    "Update a note by id",
    (builder) => {
      builder
        .positional("id", {
          describe: "Note ID",
          type: "number",
        })
        .positional("title", {
          describe: "New note title",
          type: "string",
        })
        .positional("content", {
          describe: "New note content",
          type: "string",
        });
    },
    errorHandler(async ({ id, title, content }) => {
      const updatedNote = await updateNoteById({
        id: validateId(id),
        title: validateText(title, "Title"),
        content: validateText(content, "Content"),
      });

      if (!updatedNote) {
        throw new Error(`Cannot find note with id=${id}`);
      }

      console.log("Updated:", updatedNote);
    }, "Cannot update note"),
  )
  .command(
    "delete <id>",
    "Delete a note by id",
    (builder) => {
      builder.positional("id", {
        describe: "Note ID",
        type: "number",
      });
    },
    errorHandler(async ({ id }) => {
      const deletedNote = await deleteNoteById(validateId(id));

      if (!deletedNote) {
        throw new Error(`Cannot find note with id=${id}`);
      }

      console.log("Deleted:", deletedNote);
    }, "Cannot delete note"),
  )
  .demandCommand(1, "Please provide a command")
  .strict()
  .fail((message, error) => {
    console.error(error?.message || message);
    process.exit(1);
  })
  .help("h")
  .alias("h", "help")
  .version("1.0.0")
  .alias("v", "version")
  .parse();