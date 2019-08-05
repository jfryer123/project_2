// console.ldog(process.env.MONGODB_URI);
//dependencies
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
require('dotenv').config()
const Court = require('./models/appmodels/data.js');
const app = express()


// Configuration
const PORT = process.env.PORT
const mongoURI = process.env.MONGODB_URI

// Middleware
// allows us to use put and delete methods
app.use(express.static('public'));

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
// Error / success
// db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
// db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
// db.on('disconnected', () => console.log('mongo disconnected'));

//routes
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
      Court.find({}, (error, allCourts) => {
          res.render('app/appindex.ejs',{
              courts:allCourts
          });
        })
    } else {
        res.redirect('/sessions/new');
    }
});

// app index page
// app.get('/app', (req, res) => {
//         res.render('app')
//
//     })


//edit a court Route
app.get("/app/:id/edit", (req,res) => {
    Court.findById(req.params.id, (err, foundCourt) => {
        res.render("app/appedit.ejs",
        {
            court:foundCourt
        });
    });
});

//show the court page
app.get('/app/:id', (req, res)=>{
    Court.findById(req.params.id, (err, foundCourt)=>{
      console.log(err);
      console.log(foundCourt);
      console.log("=========");
        res.render('app/appshow.ejs', {
            court:foundCourt
        });
    });
})

//create new court route
app.post('/app', (req, res) => {
    // if(req.body.playing === 'on'){
    //     req.body.playing = true;
    // } else {
    //     req.body.playing = false;
    // }
    Court.create(req.body, (error, createdCourt) => {
      console.log(error);
      console.log(req.body);
        res.redirect('/app');
    });
});

//update
app.put("/app/:id", (req,res) => {
    Court.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedProduct) => {
        console.log(updatedProduct);
        res.redirect("/app");
    });
});

app.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id, (err, deletedProduct) => {
      console.log(deletedProduct);
        res.redirect('/app');
      });
})

const userController = require('./controllers/users.js')
app.use('/users', userController)

const sessionsController = require('./controllers/sessions.js')
app.use('/sessions', sessionsController)

// Listen
app.listen(PORT, () => console.log('auth happening on port', PORT))
