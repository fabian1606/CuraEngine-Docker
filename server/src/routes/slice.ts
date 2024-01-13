import { Request, Response, Router } from 'express';
import isAuthed from '../middleware/isAuthed';
import sliceModel from '../api/slice';
import multer from 'multer';
import { APP_DIR } from '../constants';
const router: Router = Router();

const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage: storage });


router.post('/', isAuthed,upload.single("file"),(req: Request, res: Response): void => {
   if (!req.file) res.status(400).send('No files were uploaded.');
   else{
     sliceModel(req.file!.filename, req.body.printer)
     .then(() => {
        res.download(`${APP_DIR}/outputs/${req.file!.fieldname.split(".")[0]}.gcode`);
        console.log("sliced");
      })
      .catch((err:Error) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
   }
});

export default router;