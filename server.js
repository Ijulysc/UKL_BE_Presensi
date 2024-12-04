
const express = require('express');
const app = express();
const port = 8000;

const absenRoutes = require('./routes/absen.route');
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');

app.use(express.json()); // Untuk meng-handle JSON body

// Menggunakan routes
app.use('/api/absen', absenRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Menjalankan server
app.use('/api/user', userRoutes, (req, res, next) => {
    console.log(`Request received on /api/user: ${req.method} ${req.url}`);
    next();
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
