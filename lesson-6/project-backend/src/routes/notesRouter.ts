import {Router, Request, Response, NextFunction} from "express";

import prisma from "../../db";

import { NotFoundError, ValidationError } from "../errors";

import notes from "../notes";

type NotesQuery = {
    search?: string;
}

type NoteParams = {
    id: string | number;
}

type NoteParamsValid = {
    id: number;
}

const validateNote = (req: Request, res: Response, next: NextFunction)=> {
    const {title, content} = req.body;
    if(!title || !content) throw new ValidationError("title and content required fields");
    next();
}

const validateId = (req: Request<NoteParams>, res: Response, next: NextFunction)=> {
    const {id} = req.params;
    const numberId = Number(id);
    if(Number.isNaN(numberId)) {
        throw new ValidationError(`${id} not valid id format`);
    }
    req.params.id = numberId;
    next();
}

const notesRouter = Router();

notesRouter.get("/", async (req: Request<{}, {}, {}, NotesQuery>, res: Response)=> {
    const notes = await prisma.note.findMany({
        orderBy: {
            title: "asc"
        }
    });
    res.json(notes);
})

notesRouter.get("/:id", validateId, async (req: Request<NoteParamsValid>, res)=> {
    const {id} = req.params;
    const note = await prisma.note.findUnique({
        where: {
            id,
        }
    })
    if(!note)throw new NotFoundError(`Cannot find note with id=${id}`);
    
    res.json(note);
})

notesRouter.post("/", validateNote, async (req, res)=> {
    const newNote = await prisma.note.create({
        data: req.body,
    });
    res.status(201).json(newNote);
})

notesRouter.put("/:id", validateId, async (req: Request<NoteParamsValid>, res)=> {
    const {id} = req.params;
    const updateNote = await prisma.note.update({
        where: {
            id,
        },
        data: req.body,
    });
    if(!updateNote) throw new NotFoundError(`Cannot find note with id=${id}`);
    res.json(updateNote);
})

notesRouter.delete("/:id", validateId, async (req: Request<NoteParamsValid>, res)=> {
    const {id} = req.params;
    const deleteNote = await prisma.note.delete({
        where: {
            id
        }
    });
    if(!deleteNote) throw new NotFoundError(`Cannot find note with id=${id}`);
    res.json(deleteNote);
})

export default notesRouter;
