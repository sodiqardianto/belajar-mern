import express from 'express';
import cors from 'cors';
import session from 'express-session';
import UserRoute from './routes/UserRoute';
import ProductRoute from './routes/ProductRoute';
import AuthRoute from './routes/AuthRoute';
import SequelizeStore from 'connect-session-sequelize';
import db from './config/database';

const app = express();

const sessionStore = SequelizeStore(session.Store) as any;
const store = new sessionStore({
    db: db,
});

app.use(session({
    secret: process.env.APP_SECRET as string,
    resave: false,
    saveUninitialized: true,
    store: store,
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

// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server running')
});