const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const port = 3000
const User = require('./models/Attendee')
const fs = require('fs')
const path = require('path')
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server);
const csvtojson = require('csvtojson')

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile)
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use('/asset', express.static(path.join(__dirname, 'asset')))

app.get('/', function (req, res) {
  res.render("dashboard.ejs");
});

app.get('/qr', function (req, res) {
  res.render("page2.ejs");
});

app.use(cors())
const mongo_URI = 'mongodb+srv://SAC:G8BO4x3rWEDFSYqk@cluster0.btu1pyt.mongodb.net/employee' // use local one
// const mongo_URI = 'mongodb://0.0.0.0:27017/employee'
mongoose.connect(mongo_URI, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(result => {console.log('Connected To DB')})
  .catch(err => console.error(err))

server.listen(port, () => console.log(`Server started on Port ${port}`))

app.post("/upload", (req, res) => {
  console.log(req);
  const data = req.body;
  // console.log(data.image64);
  const imageData = data.image64.replace(/^data:image\/\w+;base64,/, '');
   const buffer = Buffer.from(imageData, 'base64');

  fs.writeFile(`./uploads/img.png`, buffer, err => {
    if (err) {  res.status(500).send({ error: 'Error saving image' })} 
    else {  
      io.emit('navigate')
      }
  });
})

io.on('connection', (socket) => {
  console.log('a user connected');
  // csvtojson()
  // .fromFile("qr.csv")
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
      const result = await User.find( { "isAttended": false })
      .skip((e-1) * 110)
      .limit(110)
      io.emit('userList', result)
    }
    asyncCall();
  })

  socket.on('getUrl' ,(e) => {
    console.log(e);
    const imageData = e.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(imageData, 'base64');
 
   fs.writeFile(`./uploads/img.png`, buffer, err => {
     if (err) {  res.status(500).send({ error: 'Error saving image' })} 
     else {  
       io.emit('navigate')
       }
   });
  })

  socket.on('getUser' , (e) => {
    console.log(e);
    async function asyncCall() {
      // await User.updateOne({"uniquecode":e},{$set: {"isAttended":true}})
      const result = await User.findOne( { "uniquecode": e.toLowerCase() } )
      console.log(result);
      io.emit('userDetails',result )
    }
    asyncCall();
  })
  
});