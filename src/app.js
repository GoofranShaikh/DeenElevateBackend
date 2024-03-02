const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const productRoutes=require('../src/routes/productRoutes')
const session = require('express-session');
const cors = require('cors');
var bodyParser = require('body-parser');
app.use(cors());
app.use(express.static('images'));
app.use(bodyParser.json());
app.use(cookieParser());

// Middleware to handle cart data
// Middleware to handle cart data
// Configure session middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: true, // Set to true if using HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Middleware to handle cart data
// app.use((req, res, next) => {
//   console.log(req.session,'session')
//   if (!req.session.cart) {
//       req.session.cart = []; // Initialize cart if it doesn't exist
//   }
//   console.log(req.session.cart,'req.session.cart')
//   next();
// });


app.use('/api/v1/',productRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
