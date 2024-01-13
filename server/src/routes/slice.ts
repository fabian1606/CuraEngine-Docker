import { Request, Response, Router } from 'express';
import isAuthed from '../middleware/isAuthed';
import sliceModel from '../api/slice';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // Um eine eindeutige UUID zu generieren
import { APP_DIR } from '../constants';
import path from 'path';
import fs from 'fs';

const router: Router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uuid = uuidv4();
    const uploadDir = path.join(APP_DIR, 'uploads', uuid,".stl");
    console.log(uploadDir);
    

    fs.mkdirSync(uploadDir, { recursive: true }); // Erstelle den Ordner rekursiv, falls er nicht existiert

    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname); // Verwende den Originalnamen der Datei
  },
});

const upload = multer({ storage: storage });

router.post('/', isAuthed, upload.single("file"), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).send('No files were uploaded.');
  } else {
    console.log(req.file.destination);
    sliceModel(req.file.destination, req.body.printer)
      .then(() => {
        const slicedFilePath = path.join(APP_DIR, 'output', req.file!.filename.split(".")[0] + '.gcode');
        res.download(slicedFilePath);
        console.log("sliced");
      })
      .catch((err: Error) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  }
});

export default router;
