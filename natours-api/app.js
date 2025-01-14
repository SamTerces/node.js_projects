const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error-controller');
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // console.log(x); this will cause an uncaught exception error. Any middleware in express will automatically go to the error handling middleware with that error.So any error in middleware will automatically go to the error handling in error-controller.js
  // console.log(x);

  // add a property called requestTime to the request obj
  req.requestTime = new Date().toISOString();
  next();
});

// console.log(x);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // whatever gets passed into next(), express will know/assume it's an error. This applies for all next() in any part of the app. So express will then skipp all the othr middleware in the middleware stack and set the error that we passed in to our global error handling middleware which will then be executed

  // this code would be placed and used in each catch block to handle each error in a handler, but using a class is better so you don't have to repeat the code
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

// example of error handling middleware without using global handler class
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
app.use(globalErrorHandler);

module.exports = app;
