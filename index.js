const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
var bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@todoapp.mfoky.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();

        console.log('Todo app connected with MongoDB');
    } finally {
        // await client.close();
    }
} run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Todo server started!')
})

app.listen(port, () => {
    console.log(`Todo app listening on port ${port}`)
})
