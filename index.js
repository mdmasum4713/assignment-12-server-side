const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mn7xzd7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const newsCollection = client.db("newspaperDB").collection("news")
    const newsCartCollection = client.db("newspaperDB").collection("newsCart")
    



    

    //news related api
    app.get('/news', async (req, res) => {
        const result = await newsCollection.find().toArray();
        res.send(result);

      })
      app.get('/myNews/:userEmail', async (req, res) =>{
        const userEmail = req.params.userEmail
        console.log(userEmail)
        const query = {userEmail: userEmail}
        const result = await newsCartCollection.find(query)
        res.send(result)
      })

      app.post('/news', async(req, res) =>{
        const item = req.body;
        const result = await newsCollection.insertOne(item);
        res.send(result);
      })

      //news cart related
      app.get('/newsCart', async (req, res) => {
        const result = await newsCartCollection.find().toArray();
        res.send(result);

      })

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('newspaper is sitting')
})

app.listen(port, () =>{
    console.log(`Newspaper is sitting on the port ${port}`);
})