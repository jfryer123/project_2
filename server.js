// console.ldog(process.env.MONGODB_URI);
//dependencies
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
require('dotenv').config()
const app = express()


// Configuration
const PORT = process.env.PORT
const mongoURI = process.env.MONGO_URI

// Middleware
// allows us to use put and delete methods
app.use(methodOverride('_method'))
// parses info from our input fields into an object
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))

// Database
mongoose.connect(mongoURI, { useNewUrlParser: true })
mongoose.connection.once('open', ()=> {
  console.log('connected to mongo', mongoURI)
})
//add a NEW court page
app.get('/app/new', (req, res) => {
  res.render('app/appnew.ejs')
})

// main login/sign-up
app.get('/', (req, res) => {
  res.render('index.ejs', {
  currentUser: req.session.currentUser
});
})

//direct to app index page once logged in
app.get('/app', (req, res)=>{
  if(req.session.currentUser){
        res.render('app/appindex.ejs')
    } else {
        res.redirect('/sessions/new');
    }
})

//edit a court Route
app.get("/app/:id/edit", (req,res) => {
    Court.findById(req.params.id, (err, foundCourt) => {
        res.render("app/appedit.ejs",
        {
            court:foundCourt
        });
    });
});

//app index page
app.get('/app/appindex', (req, res) => {
    Court.find({}, (error, allCourts) => {
        res.render('app/appindex.ejs',{
            courts:allCourts
        });
    })
});

//show the court page
app.get('/app/:id', (req, res)=>{
    Court.findById(req.params.id, (err, foundCourt)=>{
        res.render('app/appshow.ejs', {
            court:foundCourt
        });
    });
});

app.post('/app/appindex', (req, res) => {
    if(req.body.playing === 'on'){
        req.body.playing = true;
    } else {
        req.body.playing = false;
    }
    Court.create(req.body, (error, createdCourt) => {
        res.redirect('/app/appindex');
    });
});

const userController = require('./controllers/users.js')
app.use('/users', userController)

const sessionsController = require('./controllers/sessions.js')
app.use('/sessions', sessionsController)

// Listen
app.listen(PORT, () => console.log('auth happening on port', PORT))
