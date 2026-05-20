import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/configdb';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middlewares/errorHandler';
import { checkPendingOrders } from './utils/autoConfirm';

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route
app.get('/', (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'TuShoes API Server đang hoạt động!',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', productRoutes);

app.use(errorHandler);

connectDB();

// Sync database
const db = require('./models/index');
db.sequelize.sync()
    .then(() => {
        console.log('Đồng bộ database thành công.');
        // Chạy cron job/quét đơn hàng chưa xác nhận khi khởi động
        checkPendingOrders();
    })
    .catch((err) => {
        console.error('Lỗi đồng bộ database:', err);
    });

let port = process.env.PORT || 8089;
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});
