const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// connect to db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useFindAndModify: false, // no longer supported as of mongoose 6.0
    useUnifiedTopology: true
    //useCreateIndex: true // no longer supported as of mongoose 6.0
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.log('DB CONNECTION ERROR: ', err))

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');

// app midllewares
app.use(morgan('dev'))
app.use(express.json()) // body-parser package is now deprecated and it is now built-in to express version 4.16+
app.use(express.urlencoded({ extended: true }))
// app.use(cors()) // allows all origins
if (process.env.NODE_ENV = 'development') {
  app.use(cors({origin: `http://localhost:3000`}))
}

// middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', recipeRoutes);

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`API is running on port ${port} - ${process.env.NODE_ENV}`)
})