import {Router, Request, Response, NextFunction} from "express";

import { NotFoundError, ValidationError } from "../errors";

import notes from "../notes";

type NotesQuery = {
    search?: string;
}

const validateNote = (req: Request, res: Response, next: NextFunction)=> {
    const {title, content} = req.body;
    if(!title || !content) throw new ValidationError("title and content required fields");
    next();
}

const notesRouter = Router();

notesRouter.get("/", (req: Request<{}, {}, {}, NotesQuery>, res: Response)=> {
    // res.json(null);
    const {search} = req.query;
    let result = notes;
    if(search) {
        const normalizeSearch = search.toLowerCase();
        result = notes.filter(({title, content})=> {
            return title.toLowerCase().includes(normalizeSearch) || content.toLowerCase().includes(normalizeSearch)
        }); 
    }
    res.json(result);
})

notesRouter.get("/:id", (req, res)=> {
    const id = Number(req.params.id);
    const note = notes.find(item => item.id === id);
    if(!note)throw new NotFoundError(`Cannot find note with id=${id}`);
    
    res.json(note);
})

notesRouter.post("/", validateNote, (req, res)=> {
    const prevId = notes[notes.length - 1].id;
    const newNote = {
        id: prevId + 1,
        ...req.body,
    }
    notes.push(newNote);
    res.status(201).json(newNote);
})

notesRouter.put("/:id", (req, res)=> {
    res.json(notes[0])
})

notesRouter.delete("/:id", (req, res)=> {
    res.json(notes[0])
})

export default notesRouter;