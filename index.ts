import express from 'express';
import cors from 'cors';
import session from 'express-session';
import UserRoute from './routes/UserRoute';
import ProductRoute from './routes/ProductRoute';
import AuthRoute from './routes/AuthRoute';

const app = express();

app.use(session({
    secret: process.env.APP_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));

app.use(express.json());
app.use(AuthRoute)
app.use(UserRoute);
app.use(ProductRoute);

app.listen(process.env.APP_PORT, () => {
    console.log('Server running')
});