// importing required modules
//my email for mongoDb: saifulislam.freelancer.uiu@gmail.com
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = 2000;

//calling the app
const app = express();

// app.use(express.json());
// app.use(express.urlencoded({
//   extended: true
// }));

// first line of code connects this server to mongodb
// 2nd line calls the mongoclient
const uri =
  "mongodb+srv://saiful:mynameisrifat@cluster0.xjw5r.mongodb.net/appdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  // express directory, sending file to homepage//
  res.sendFile(__dirname + "/index.html");
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Everything happens in client.connect
client.connect((err) => {
  console.log("database connected");
  const ProductCollection = client.db("appdb").collection("products");

  // perform actions on the ProductCollection object

  //   posting things to database
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    ProductCollection.insertOne(product).then((result) => {

      res.redirect('/')
    });
  });

  // trying to read the server documents
  app.get("/products", (req, res) => {
    ProductCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    });
  });

  // reading single element

  app.get('/product/:id', (req,res)=>{
    ProductCollection.find({_id : ObjectId(req.params.id)})
    .toArray((err, document)=>{
      res.send(document[0])
    })
  })

  // Update

  app.patch('/update/:id', (req,res)=>{

    ProductCollection.updateOne({_id:ObjectId(req.params.id)},
    {
      $set:{price:req.body.price, quantity: req.body.quantity}
      
    })
    .then (result =>{
      
        res.send(result.modifiedCount >0)
        
      
    })
 
  
  })


  // Deleting item
  app.delete("/delete/:id", (req, res) => {
    ProductCollection.deleteOne({ _id: ObjectId(req.params.id) })
    .then(
      (result) => {
        res.send(result.deletedCount>0)
      }
    );
  });









});

app.listen(port, () => {
  console.log(`App is listing at  port http://localhost:${port}`);
});
