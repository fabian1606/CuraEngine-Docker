import express,{ RequestHandler } from 'express';
import type { Express } from 'express';
import {PORT,CORS_ORIGN} from './constants';
import passport from 'passport';
import initPassport from './services/passport';
import cors from 'cors';
import routes from './routes';



const app: Express = express();
const port: number = parseInt(PORT, 10) || 3000;

const passportInitialize: RequestHandler = passport.initialize();

app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.json());
app.use(passportInitialize);
initPassport();

app.use(
  cors({
    origin: CORS_ORIGN,
    credentials: true,
  }),
);

app.use('/',routes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
