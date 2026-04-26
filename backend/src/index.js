const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const seedPlans = require('./config/seedPlans');
const AppError = require('./utils/AppError');
const cors = require("cors");
const app = express();
app.use(express.json());

app.use(cors());
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected ✅');
    await seedPlans();
  })
  .catch((err) => console.log('DB Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payment', paymentRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));