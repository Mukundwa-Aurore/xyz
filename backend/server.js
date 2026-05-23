require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const db = require('./models');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'XWZ Parking API',
      version: '1.0.0',
      description: 'API documentation for XWZ Parking Management System',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/parking', require('./routes/parking'));
app.use('/api/parking-logs', require('./routes/parkingLogs'));
app.use('/api/reports', require('./routes/reports'));

const bcrypt = require('bcryptjs');
const PORT = process.env.PORT || 5000;

const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await db.User.findOne({ where: { role: 'admin' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@xwzparking.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Default admin created!');
      console.log('Email: admin@xwzparking.com');
      console.log('Password: admin123');
      console.log('⚠️ Please change this password immediately!');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

db.sequelize.sync().then(() => {
  createDefaultAdmin().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API docs available at http://localhost:${PORT}/api-docs`);
    });
  });
});
