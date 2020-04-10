const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://127.0.0.1:27017/userauth')

const app = express()

//if('development' == app.get('env')) {
    // app.use(express.errorHandler());
    // mongoose.connect('mongodb://127.0.0.1:27017/userauth')
//}

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes

app.post('/signup', (req, res, next) => {
    const newUser = new User({
        email: req.body.email,
        name: req.body.name, 
        password: bcrypt.hashSync(req.body.password, 10)
    })
    newUser.save( err => {
        if (err) {
           return res.status(400).json({
               title: 'error',
               error: 'email in use'
           })     
        }
        return res.status(200).json({
            title: 'signup success'
        })
    })
})

app.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).json({
            title: 'server error',
            error: err
        })
        if (!user) {
            return res.status(401).json({
                title: 'user not found', 
                error: 'Invalid credentials'
            })
        }
        // Incorrect password
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'login failed',
                error: 'invalid credentials'
            })
        }
        // IF ALL IS GOOD, create a token and sedn it to client
        let token = jwt.sign({ userId: user._id}, 'jayantamgr');
        return res.status(200).json({
            title: 'login success',
            token:token
        })
    })
})

app.get('/user', (req, res, next) => {
    let token = req.headers.token; // token
    jwt.verify(token, 'jayantamgr', (err, decoded) => {
        if (err) return res.status(401).json({
            title: 'unauthorrized'
        })
        console.log(decoded);
        // token is valid
        User.findOne({ _id: decoded.userId }, (err, user) => {
            if (err) return res.status(401).json({
                title: `Coulddn't authorized`
            })
            return res.status(200).json({
                title: 'User grabbed',
                user: {
                    email: user.email,
                    name: user.name
                }
            })
        })

    })
})


//app.get('/', function (req, res) {
  //  throw new Error('BROKEN') // Express will catch this on its own.
  //})

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
    if (err) return console.log(err);
    console.log('Server is runnging on port ' + port);
})