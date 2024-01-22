import express from 'express';
import bodyParser from 'body-parser'; 
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import boardingRoutes from './routes/boardingRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import utilityRoutes from './routes/utilityRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import reservationHistoryRoutes from './routes/reservationHistoryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express(); 

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/boardings', boardingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reservationsHistory', reservationHistoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/menues', menuRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/utilities', utilityRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/orders', orderRoutes);

if(process.env.NODE_ENV === 'production'){
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')));

    app.get('/*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
}else{
    app.get('/', (req, res) => res.send('Server is ready'));
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
    connectDB();
});


