var express = require("express");
var app = express();
var path = require('path');

var bodyParser = require("body-parser");
var ObjectId = require("mongodb").ObjectId;

var http = require("http").createServer(app);
var io = require("socket.io")(http);

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var formidable = require("formidable");
var fs = require("fs");

app.use("/static",express.static(__dirname+ "/static"));
app.set('views', path.join(__dirname, 'views'));

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
let clients = 0;


var configDB = require('./config/database.js');

mongoose.connect(configDB.url); 

require('./config/passport')(passport); 

app.use(cookieParser()); 
app.use(session({
    secret: 'laptop', // 
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash());

require('./app/routes.js')(app, passport); 

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost:27017",{useNewUrlParser:true},
function(error,client){
    var flightsdb = client.db("flightsdb");
    console.log("DB connected");

    

  app.get("/", function(req,res){
      flightsdb.collection("settings").findOne({},
        function(error,settings){

          flightsdb.collection("flights").find().toArray(function(error,flights){
          flights = flights.reverse();
          res.render("user/home",{flights:flights });
        });
      });
    });

    app.get("/admin/dashboard",function(req,res,next){
      if (req.isAuthenticated())
      return next();
        res.redirect('/admin');
      });
  app.get("/videochat", function(req, res){
    res.render("videochat.ejs");
            });

  app.get("/do-logout",function(req,res){
      req.session.destroy();
      res.redirect("/admin");
  });

  app.get("/admin/flights",function(req,res,next){
  if (req.isAuthenticated())
  return next();
    res.redirect('/admin');
  });

        
  app.get("/admin/flights",function(req,res){
    flightsdb.collection("flights").find().toArray(function(error,flights){
        res.render("admin/flights",{"flights" : flights});
        });
  });

  app.get("/flights/edit/:id",function(req,res){
      flightsdb.collection("flights").findOne({
      "_id" : ObjectId(req.params.id)} ,
      function(error,flight){
        res.render("admin/edit_flight",{"flight":flight});
      });
  });


  app.post("/do-post",function(req,res){
      flightsdb.collection("flights").insertOne(req.body,function(error,document){

      res.send({
          text: "posted successfully",
          _id: document.insertedId
      });
    });
  });

  app.get("/flights/:id",function(req,res){
      flightsdb.collection("flights").findOne({"_id":ObjectId(req.params.id)},function(error,flight){
      res.render("user/flight",{flight:flight});
     });
  });


  app.post("/do-edit-post",function(req,res){
    flightsdb.collection("flights").updateOne({
   	"_id":ObjectId(req.body._id)},
   	{
   		$set:{
   			"fname": req.body.fname,
   			"dcity": req.body.dcity,
   			"acity": req.body.acity,
   			"ddate": req.body.ddate,
   			"adate": req.body.adate,
   			"price": req.body.price,
        "image": req.body.image
   		}
   	}, function(error,flight){
   		res.send("Updated successfully");
   	 });
  });

   
  app.post("/do-delete",function(req,res){
    fs.unlink(req.body.image.replace("/",""),function(error){
      flightsdb.collection("flights").remove({
      "_id": ObjectId(req.body._id)},
      function(error,document){
        res.send("Deleted");
            });
        });
  });


  app.post("/do-order",function(req,res){
    flightsdb.collection("flights").updateOne({"_id":ObjectId(req.body.flight_id)},{
      
        $push:{
            "orders": {name: req.body.name,surname: req.body.surname,
                    pnumber:req.body.pnumber,passnumber:req.body.passnumber }
          }
      },function (error,flight){
              res.send({
                text: "Ordered successfully",
                _id: flight.insertedId
              });
        });
  });

  app.post("/do-upload-image", function(req,res){
    var formData = new formidable.IncomingForm();
    formData.parse(req, function(error,fields,files){
      var oldPath = files.file.path;
      var newPath = "static/images/" + files.file.name;
      fs.rename(oldPath,newPath,function(err){
        res.send("/" + newPath);
      });
    });
  });
  
  app.post("/do-update-image",function(req,res){
    var formData = new formidable.IncomingForm();
    formData.parse(req, function(error,fields,files){

      fs.unlink(fields.image.replace("/",""),function(error){
          var oldPath = files.file.path;
          var newPath = "static/images/" + files.file.name;
          fs.rename(oldPath,newPath,function(err){
          res.send("/" + newPath);
 
          });
        });
      });
  });

  io.on("connection",function(socket){  //real TIME
    console.log("User Connected");
    socket.on("new_post",function(formData){
      console.log(formData);
      socket.broadcast.emit("new_post",formData);
    });
    socket.on("new_order", function(order){
      io.emit("new_order",order)
    });
    socket.on("delete_post",function(replyId){
      socket.broadcast.emit("delete_post",replyId);
    });

    socket.on('ready', (room, callback) => {
          socket.join(room);
          socket.broadcast.to(room).emit('announce', {
              message: 'New client in the ' + room + ' room.'
          });
          callback('');
      });

    socket.on('send', (req, callback) => {
      io.to(req.room).emit('message', {
          message: req.message,
          author: req.author
        });
       });

    socket.on("NewClient", function () {
      if (clients < 2) {
          if (clients == 1) {
              this.emit('CreatePeer')
          }
      }else{
          this.emit('SessionActive')
      }
      clients++;
  })
    socket.on('Offer', SendOffer);
    socket.on('Answer', SendAnswer);
    socket.on('disconnect', Disconnect);
  });

 

  function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
  }

  function SendOffer(offer) {
      this.broadcast.emit("BackOffer", offer)
  }

  function SendAnswer(data) {
      this.broadcast.emit("BackAnswer", data)
  }


  function normalizePort(val) {
      var port = parseInt(val, 10);
    
      if (isNaN(port)) {
        return val;
      }
    
      if (port >= 0) {
        return port;
      }
    
      return false;
  }
  var port = normalizePort(process.env.PORT || 3000);

  http.listen(3000,function(){
      console.log("Connected");

  });
  });
