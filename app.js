const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const path = require('path');
const User = require('./models/user');
const csrf = require('csurf');
const flash = require('connect-flash');

const csrfProtection = csrf();

const MONGODB_URI = 'mongodb+srv://Rathtana:admin1@cluster0-bfxys.mongodb.net/shop?retryWrites=true{ useNewUrlParser: true }';

//creating an express object stored in app
const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

//setting ejs as the templating engine
app.set("view engine", "ejs");
//setting directory
app.set("views", "views");

//parse the incoming request
app.use(bodyParser.urlencoded({ extended: false }));

//to grant acess to the public folder
app.use(express.static(path.join(__dirname, "public")));

//default setting for session 
app.use(session({
  secret: 'my secret', 
  resave: false, 
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if(req.session.user) {
    User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
  } else {
    return next();
  }
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


//to avoid the browser requesting for favicon
app.get("/favicon.ico", (req, res) => res.status(204));

//main routes
app.use("/admin", adminRoutes);

// //default routes /
app.use(shopRoutes);

app.use(authRoutes);

//handle not found
app.use(errorController.get404);

//connect to the database 
mongoose.connect(MONGODB_URI)
.then(result => {
  app.listen(3000);
})
.catch(err => {
  console.log(err);
})




