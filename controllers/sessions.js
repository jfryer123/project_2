const bcrypt = require('bcrypt')

const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')


sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs')
})

sessions.post('/', (req, res) => {
  console.log(req.body);
    User.findOne({ username: req.body.username }, (err, foundUser) => {
      console.log(foundUser);
      console.log(err);
      if( bcrypt.compareSync(req.body.password, foundUser.password) ){
          req.session.currentUser = foundUser;
            res.redirect('/');
        } else {
            res.send('<a href="/">wrong password</a>');
        }
    })
})

sessions.delete('/', (req, res)=>{
  console.log("baiobf");
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = sessions
