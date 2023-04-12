const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const port = 4000
const User = require('./models/Attendee')
const fs = require('fs')
const path = require('path')
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server);
const csvtojson = require('csvtojson')
const { log } = require('console')

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile)
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true,limit: '50mb'}));
app.use('/asset', express.static(path.join(__dirname, 'asset')))

app.get('/', function (req, res) {
  res.render("dashboard.ejs");
});

app.get('/page-one', function (req, res) {
  res.render("page1.ejs");
});

app.get('/page-two', function (req, res) {
  res.render("page2.ejs");
});

app.get('/page-three', function (req, res) {
  res.render("page3.ejs");
});

app.get('/page-four', function (req, res) {
  res.render("page4.ejs");
});

app.use(cors())
const mongo_URI = 'mongodb+srv://SAC:G8BO4x3rWEDFSYqk@cluster0.btu1pyt.mongodb.net/userlist'
mongoose.connect(mongo_URI, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(result => {console.log('Connected To DB')})
  .catch(err => console.error(err))

server.listen(port, () => console.log(`Server started on Port ${port}`))

io.on('connection', (socket) => {
  console.log('a user connected');
  // csvtojson()
  // .fromFile("final.csv")
  // .then(csvData => {
  //   User.insertMany(csvData).then( () => {
  //     console.log("DONEEE");
  //   })
  // }) 
  socket.on('getEmails' ,(e) => {
    async function asyncCall() {
      const result = await User.find({ $or: [ { "email": e }, { "phone":e} ] })
      io.emit('userList', result)
    }
    asyncCall();
  })
 
  socket.on('getAll' ,(e) => {
    async function asyncCall() {
      const list = await User.count({ "isAttended": false })
      io.emit('count', list)
      const result = await User.find( { "isAttended": true })
      .skip((e-1) * 120)
      .limit(120)
      io.emit('userList', result)
    }
    asyncCall();
  })

  socket.on('getUserOne' , (e) => {
    console.log(e);
    async function asyncCall() {
      await User.updateOne({"uniquecode":e.toLowerCase()},{$set: {"isAttended":true}})
      const result = await User.findOne( { "uniquecode": e.toLowerCase() } )
      io.emit('userDetailsOne',result )
    }
    asyncCall();
  })

  socket.on('getUserTwo' , (e) => {
    console.log(e);
    async function asyncCall() {
      await User.updateOne({"uniquecode":e.toLowerCase()},{$set: {"isAttended":true}})
      const result = await User.findOne( { "uniquecode": e.toLowerCase() } )
      io.emit('userDetailsTwo',result )
    }
    asyncCall();
  })
  
  socket.on('getUserThree' , (e) => {
    console.log(e);
    async function asyncCall() {
      await User.updateOne({"uniquecode":e.toLowerCase()},{$set: {"isAttended":true}})
      const result = await User.findOne( { "uniquecode": e.toLowerCase() } )
      io.emit('userDetailsThree',result )
    }
    asyncCall();
  })

  socket.on('getUserFour' , (e) => {
    console.log(e);
    async function asyncCall() {
      await User.updateOne({"uniquecode":e.toLowerCase()},{$set: {"isAttended":true}})
      const result = await User.findOne( { "uniquecode": e.toLowerCase() } )
      io.emit('userDetailsFour',result )
    }
    asyncCall();
  })
});