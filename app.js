require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./dev/config/db.config');
const authRoutes = require('./dev/routes/auth.routes');
const usersRoutes = require('./dev/routes/user.routes');

const app = express();
const PORT = process.env.PORT || 7500;
const apiV1Router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/users', usersRoutes);

app.use('/api/dx/dev/v1', apiV1Router);

sequelize.sync()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection failed:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;