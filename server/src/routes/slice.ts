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
    const uploadDir= path.join(APP_DIR, '../uploads');
    console.log(uploadDir);
    // only create the directory if it doesn't exist
    fs.mkdirSync(uploadDir, { recursive: true });

    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uuid = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, uuid + extension);
  },
});

const upload = multer({ storage: storage });

router.post('/', isAuthed, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'printerDefinition', maxCount: 1 }]), (req: Request, res: Response): void => {
  const modelFile:Express.Multer.File = (req.files as Record<string, Express.Multer.File[]>).file?.[0];
  const printerDefinitionFile:Express.Multer.File = (req.files as Record<string, Express.Multer.File[]>).printerDefinition?.[0];

  if (!modelFile || !printerDefinitionFile) {
    res.status(400).send('Both model file and printer definition file are required.');
  } else {
    const slicedFilePath: string = path.join(APP_DIR, '/../outputs', modelFile.filename.split(".")[0] + '.gcode');
    sliceModel(modelFile.filename, printerDefinitionFile.filename)
      .then(() => {
        console.log(slicedFilePath);

        res.download(slicedFilePath, (err: Error) => {
          if (err) {
            console.error(err);
            res.status(500).send(err.message);
          } else {
            console.log("Slice successful");
            deleteFiles(modelFile.path,printerDefinitionFile.path, slicedFilePath);
          }
        });
      })
      .catch((err: Error) => {
        console.error(err);
        res.status(500).send(err.message);
        // deleteFiles(modelFile.path,printerDefinitionFile.path, slicedFilePath);
      });
  }
});

export default router;
