var express = require('express');
var app = express();
let fs = require('fs');
const bodyParser = require("body-parser");
let mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

function insertToDB(myobj){
 mongo.connect('mongodb://localhost:27017', (err, client) => {
   console.log('Connected successfully to database');

   let db = client.db('sweetooth');
   let collection = db.collection('recipes');
    collection.insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
     client.close();
    });
 });
}

function insertContactToDB(myobj){
  mongo.connect('mongodb://localhost:27017', (err, client) => {
    console.log('Connected successfully to database');
 
    let db = client.db('sweetooth');
    let collection = db.collection('contacts');
     collection.insertOne(myobj, function(err, res) {
       if (err) throw err;
       console.log("1 document inserted");
      client.close();
     });
  });
 }
 
function insertDocToDB(){
  mongo.connect('mongodb://localhost:27017', (err, client) => {
    console.log('Connected successfully to database');
 
    let db = client.db('sweetooth');
    let collection = db.collection('recipes');

    fs.readFile('sweetooth.recipes.json', (err, data) => {
      let recipes = JSON.parse(data);
      collection.insertMany(recipes, (err, result) => {
        console.log(`Inserted ${result.result.n} records`);
        client.close();
      });
    });
   
 });
}

function getRecipes(){
  mongo.connect('mongodb://localhost:27017', (err, client) => {
    console.log('Connected successfully to database');
 
    let db = client.db('sweetooth');
    let collection = db.collection('recipes');
     collection.find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      client.close();
    });
  });

}


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.post('/form', function (req, res) {
  var obj={"name": req.body.user.recipe_name,"ingredients":req.body.user.ingredients,"steps":req.body.user.steps,"photo_link":req.body.user.photo,"likes":0};
  insertToDB(obj);
  res.redirect('http://127.0.0.1:5500/recipes.html');
 });

 app.post('/insert_doc', function (req, res) {
 // var obj={"name": req.body.user.recipe_name,"ingredients":req.body.user.ingredients,"steps":req.body.user.steps,"photo_link":req.body.user.photo,"likes":0};
  insertDocToDB();
  res.redirect('http://127.0.0.1:5500/recipes.html');
 });
 app.post('/contact_us', function (req, res) {
  var obj={"name": req.body.user.name,"email":req.body.user.email,"note":req.body.user.note};
  insertContactToDB(obj);
  res.redirect('http://127.0.0.1:5500/index.html');
 });
 app.get('/get_recipes',function(req,res){
  mongo.connect('mongodb://localhost:27017', (err, client) => {
    console.log('Connected successfully to database');
 
    let db = client.db('sweetooth');
    let collection = db.collection('recipes');
     collection.find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      client.close();
      res.send(result);
    });
  });

 })


 app.get('/get_recipe_by_id',function(req,res){
  mongo.connect('mongodb://localhost:27017', (err, client) => {
    console.log('Connected successfully to database');
 
    let db = client.db('sweetooth');
    let collection = db.collection('recipes');
  
   let id=req.query.id;
     collection.find({"_id": new ObjectId(id)}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      client.close();
      res.send(result);
    });
  });

 })
 app.get('/like',function(req,res){
  mongo.connect('mongodb://localhost:27017', { useNewUrlParser: true },(err, client) => {
    console.log('LIKE');
 
    let db = client.db('sweetooth');
    let collection = db.collection('recipes');
   let id=req.query.id;
   console.log(id);
try{ 
  var t=collection.findOneAndUpdate(
    { _id : new ObjectId(id) },
    { $inc : { likes : 1 } }, function(err, result) {
            console.log("goooood");
            if (err) throw err;
            console.log(result);
           client.close();
           res.send(result);
          }
 );
 console.log("after "+t);
   }
   catch (e){
    console.log(e);
 }




  });

 })

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})