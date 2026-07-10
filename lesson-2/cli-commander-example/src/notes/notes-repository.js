import {readFile, writeFile} from "node:fs/promises";
import { join } from "node:path";

const notesPath = join("src", "notes", "notes.json");

const updateNotes = notes => writeFile(notesPath, JSON.stringify(notes, null, 2));

export const readNotes = async ()=> {
    const data = await readFile(notesPath);
    return JSON.parse(data);
}

export const createNote = async({title, content})=> {
    const notes = await readNotes();
    const {id} = notes[notes.length - 1] || {id: 0};
    const newNote = {
        id: id + 1,
        title,
        content,
    };
    notes.push(newNote);
    await updateNotes(notes);
    return newNote;
}

export const updateNoteById = async ({id, title, content})=> {
    const notes = await readNotes();
    const index = notes.findIndex(item => item.id === id);
    if(index === -1) return null;
    notes[index] = {...notes[index], title, content};
    await updateNotes(notes);
    return notes[index];
}

export const deleteNoteById = async(id)=> {
    const notes = await readNotes();
    const index = notes.findIndex(item => item.id === id);
    if(index === -1) return null;
    const [result] = notes.splice(index, 1);
    await updateNotes(notes);
    return result;
}