const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
var bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@todoapp.mfoky.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

async function run() {
    try {
        await client.connect();

        const todoCollection = client.db('todoApp').collection('todoLists');
        console.log('Todo app connected with MongoDB');

        app.post('/todo', async (req, res) => {
            const todoDoc = req.body;
            const todoResult = await todoCollection.insertOne(todoDoc);
            res.send(todoResult);
        })

        app.get('/todo', async (req, res) => {
            res.send(await todoCollection.find({}).toArray());
        })

        app.delete('/todo/:id', async (req, res) => {
            res.send(await todoCollection.deleteOne({ _id: ObjectId(req.params.id) }));
        })

        app.put('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: body
            }
            const result = await todoCollection.updateOne(filter, updateDoc, option);
            res.send(result);
        })
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
