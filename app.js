require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./dev/config/db.config');
const authRoutes = require('./dev/routes/auth.routes');
const usersRoutes = require('./dev/routes/user.routes');

const app = express();
const PORT = process.env.PORT || 7500;

app.use(bodyParser.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', usersRoutes);

sequelize.sync()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection failed:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
