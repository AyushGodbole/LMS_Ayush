import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { config } from 'dotenv';
config();
import morgan from 'morgan';

// importing user router
import userRoute from './routes/userRoute.js'
import courseRoute from './routes/course.route.js'
import paymentRoute from './routes/payment.route.js'
import errorMiddleWare from './middlewares/error.Middleware.js';

import adminRoute from './routes/admin.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.use('/ping',(req,res)=>{
    res.send('Pong');
});

// app.use(cors({
//     origin:[process.env.FRONT_END_URL],
//     credentials:true,
// }));

app.use(cors({
    origin:process.env.FRONT_END_URL,
    credentials:true,
}))

// it will console what urls different users are trying to access.
app.use(morgan('dev'));

app.use('/api/vi/user',userRoute);

app.use('/api/vi/course',courseRoute);

app.use('/api/vi/payments',paymentRoute);

app.use('/api/vi/admin',adminRoute);

//if random url is hitted
app.all('*',(req,res)=>{
    res.status(400).send('OOPS! 404 page not found');
});

//handling errors
// as next will go to last
app.use(errorMiddleWare);

export default app;

