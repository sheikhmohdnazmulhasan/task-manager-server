const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmbjtpv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } });

async function run() {
    try {

        await client.connect();

        const todoCollection = client.db('todo').collection('todo');

        app.get('/todo', async (req, res) => {
            const query = { email: req.query.email, status: 'Todo' }
            const result = await todoCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/ongoing', async (req, res) => {
            const query = { email: req.query.email, status: 'Ongoing' };
            const result = await todoCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/completed', async (req, res) => {
            const query = { email: req.query.email, status: 'Completed' };
            const result = await todoCollection.find(query).toArray();
            res.send(result)
        });

        app.post('/new-todo', async (req, res) => {
            const data = req.body;
            const result = await todoCollection.insertOne(data);
            res.send(result);
        });

        app.patch('/todo-ongoing', async (req, res) => {
            const id = req.query.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: { status: 'Ongoing' }
            };

            const result = await todoCollection.updateOne(filter, updatedDoc);
            res.send(result)
        });

        app.delete('/delete', async (req, res) => {
            const id = req.query.id;
            const query = { _id: new ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        });

        app.patch('/todo-completed', async (req, res) => {
            const id = req.query.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: { status: 'Completed' }
            };

            const result = await todoCollection.updateOne(filter, updatedDoc);
            res.send(result)
        });


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => res.send('Task Manager Server is Running'));

app.listen(port, () => console.log('Task Manager Server is Running on PORT: ', port))