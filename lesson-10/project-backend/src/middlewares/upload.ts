import multer from "multer";
import {resolve} from "node:path";
import { randomUUID } from "node:crypto";

import { AppError } from "../errors.ts";

const destination = resolve("temp");

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb)=> {
        const newFilename = `${randomUUID()}_${file.originalname}`;
        cb(null, newFilename);
    }
})

const limits = {
    fileSize: 1024 * 1024 * 5
}

const fileFilter: NonNullable<multer.Options["fileFilter"]> = (_req, file, cb) => {
    const extension = file.originalname.split(".").pop()?.toLowerCase();

    if (extension === "exe") {
        cb(new AppError(403, ".exe files are not allowed"));
        return;
    }

    cb(null, true);
};

const upload = multer({
    storage,
    limits,
    fileFilter,
})

export default upload;
