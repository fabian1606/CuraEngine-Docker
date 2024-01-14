import { Request, Response, Router } from 'express';
import isAuthed from '../middleware/isAuthed';
import sliceModel from '../api/slice';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // Um eine eindeutige UUID zu generieren
import { APP_DIR } from '../constants';
import path from 'path';
import fs from 'fs';
import deleteFiles from '../api/deleteFiles';

const router: Router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(APP_DIR, '../uploads');
    console.log(uploadDir);
    
    
    fs.mkdirSync(uploadDir, { recursive: true }); // Erstelle den Ordner rekursiv, falls er nicht existiert
    
    cb(null, uploadDir);
  },
  filename: (_req, _file, cb) => {
    const uuid = uuidv4();
    cb(null, uuid+".stl"); // Verwende den Originalnamen der Datei
  },
});

const upload = multer({ storage: storage });

router.post('/', isAuthed, upload.single("file"), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).send('No files were uploaded.');
  } else {
    console.log(path.join(req.file.destination, req.file!.filename.split(".")[0] + '.gcode'));
    const slicedFilePath = path.join(APP_DIR, '/../outputs', req.file!.filename.split(".")[0] + '.gcode');
    sliceModel(req.file.filename, req.body.printer)
      .then(() => {
        console.log(slicedFilePath);
        
        res.download(slicedFilePath, (err: Error) => {
          if (err) {
            console.error(err);
            res.status(500).send(err.message);
          } else {
            console.log("slice successfull");
            deleteFiles(req.file!.path, slicedFilePath);
          }
        });
      })
      .catch((err: Error) => {
        console.error(err);
        res.status(500).send(err.message);
        deleteFiles(req.file!.path,null);
      })
  }
});

export default router;
