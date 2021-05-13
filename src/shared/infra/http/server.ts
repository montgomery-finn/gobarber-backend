import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from '@shared/infra/http/routes/index';
import '@shared/infra/typeorm';
import '@shared/container';
import uploadConfig from '@config/upload';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors());

app.listen(3333, () => {
    console.log('server started on port 3333');
});
