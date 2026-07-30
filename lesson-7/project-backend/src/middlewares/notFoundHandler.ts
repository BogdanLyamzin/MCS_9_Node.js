import { Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response)=> {
    res.status(404).json({
        error: {
            message: `${req.method} ${req.url} not found`,
            type: "NotFound",
            status: 404
        }
    })
};


export default notFoundHandler;