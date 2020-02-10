const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const pug = require('pug');

//port variables
const port = 3000;
const mongoUrl = "mongodb://localhost:27017/dmChest";

const app = express();
app.use(cors());

//mongoDB connection via mongoose
mongoose.connect(
    mongoUrl,
    { userUnifiedTopology: true, useNewUrlParser: true })
    .then(()=> console.log('Mongo is Connected'));
const db = mongoose.connection;
//db error catch
db.on('error', console.log.bind(console, 'connection error:'));

//use sessions fro tracking logins
app.use(session({
    secret: "The Secret door requires a perception check of 19.",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

//User Id
app.use((req, res, next) =>{
    res.locals.currentUser = req.session.userId;
    next();
});

//View engine as PUG (consider different view engine)
app.set('view engine', 'pug');
app.set('views'.__dirname + 'views');

//static files from /public
app.use(express.static(__dirname + '/public'));

//routes
const routes = require('./routes/index');
app.use('/', routes)

//404 catch and forward to error handler
app.use((req, res, next)=> {
    let err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port, ()=> {
    console.log('The chest is open, Dungeon Master')
});