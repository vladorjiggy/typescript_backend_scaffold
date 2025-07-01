import express from 'express';
import cors from "cors";
const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
import * as dotenv from "dotenv";
dotenv.config({ path: envPath });
const app = express();

app.set('trust proxy', 1); // IF YOU ARE BEHIND A PROXY

const port = process.env.PORT || 3000;
import { Logging } from './utils/logger';
const logger = new Logging('server');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const apphost = process.env.APPHOST as string
const allowedDomains = apphost.split(' ')

app.use(cors({
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);

    if (allowedDomains.indexOf(origin) === -1) {
      let msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));


if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        logger.info(`Server started at http://localhost:${port}`);
    });
}

export default app;