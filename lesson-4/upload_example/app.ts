import express from "express";
import { resolve, join } from "node:path";
import multer from "multer";

const templatesPath = resolve("templates");
const publicPath = resolve("public");
const uploadPath = resolve("upload");

const app = express();

type FieldUploadFiles = {
  avatar?: Express.Multer.File[];
  documents?: Express.Multer.File[];
};

app.use(express.static(publicPath));

app.set("view engine", "ejs");
app.set("views", templatesPath);

app.get("/memory", (req, res) => {
  const memoryPath = join(publicPath, "memory.html");
  res.sendFile(memoryPath);
});

const memoryUpload = multer({ storage: multer.memoryStorage() });

app.post("/memory", memoryUpload.single("file"), (req, res) => {
  const { originalname, mimetype, size, buffer } = req.file!;

  res.render("result", {
    title: "Варіант 1 - memoryStorage",
    back: "/memory",
    file: {
      originalname,
      mimetype,
      size,
      buffer: `Buffer(${buffer.length})`,
    },
  });
});

app.get("/disk", (req, res) => {
  const diskPath = join(publicPath, "disk.html");
  res.sendFile(diskPath);
});

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    cb(null, filename);
  },
});

class InvalidTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTypeError"
  }
}

const diskUpload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb)=> {
    if(!file.mimetype.startsWith("image/")) {
      return cb(new InvalidTypeError("only images allow"))
    }
    cb(null, true);
  }
});

app.post("/disk", diskUpload.single("file"), (req, res) => {
  const { originalname, filename, size, path: filePath } = req.file!;

  res.render("result", {
    title: "Варіант 2 - diskStorage",
    back: "/disk",
    file: {
      originalname,
      filename,
      path: filePath,
      size,
    },
  });
});

app.get("/multiple", (req, res) => {
  const multiplePath = join(publicPath, "multiple.html");
  res.sendFile(multiplePath);
});

app.post("/multiple", diskUpload.array("photos", 5), (req, res) => {
  const files = req.files!;

  res.render("result-multiple", {
    title: "Варіант 3 - upload array",
    back: "/multiple",
    files,
  });
});

app.get("/fields", (req, res) => {
  const fieldsPath = join(publicPath, "fields.html");
  res.sendFile(fieldsPath);
});

app.post(
  "/fields",
  diskUpload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "documents",
      maxCount: 3,
    },
  ]),
  (req, res) => {
    const files = req.files as FieldUploadFiles;
    console.log(files);

    res.render("result-fields", {
      title: "Варіант 3 - upload fields",
      back: "/fields",
      avatar: files.avatar?.[0],
      documents: files.documents ?? [],
    });
  },
);

app.listen(3000, () => console.log("Server running on 3000 port"));
