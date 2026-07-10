import {
  readNotes,
  createNote,
  updateNoteById,
  deleteNoteById,
} from "./notes-repository.js";

const [command, ...args] = process.argv.slice(2);

try {
  switch (command) {
    case "list":
      const allNotes = await readNotes();
      console.table(allNotes);
      break;
    case "create":
      const [title, content] = args;
      if (!title || !content) {
        throw new Error("Missing title or content");
      }
      const newNote = await createNote({ title, content });
      console.log(newNote);
      break;
    case "update":
      const [idArg, newTitle, newContent] = args;
      const id = Number(idArg);
      if (!id) {
        throw new Error("Missing id");
      }
      if (!newTitle || !newContent) {
        throw new Error("Missing title or content");
      }
      const updateNote = await updateNoteById({
        id,
        title: newTitle,
        content: newContent,
      });
      if (!updateNote) {
        throw new Error(`Cannot find note with id=${id}`);
      }
      console.log(updateNote);
      break;
    case "delete":
      const [deleteIdArg] = args;
      const deleteId = Number(deleteIdArg);
      if (!deleteId) {
        throw new Error("Missing id");
      }
      const deleteNote = await deleteNoteById(deleteId);
      if (!deleteNote) {
        throw new Error(`Cannot find note with id=${deleteId}`);
      }
      console.log(deleteNote);
      break;
    default:
      console.log(`Unknown command ${command}`);
  }
} catch (error) {
  console.error("Помилка CLI", error);
}
