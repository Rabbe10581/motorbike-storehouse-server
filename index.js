const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xbsa3bq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const bikeCollection = client.db('bikeResale').collection('categories');

        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = bikeCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })
    }
    finally {

    }

}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('resale storehouse is running')
})

app.listen(port, () => {
    console.log(`resale storehouse server is running on ${port}`);
})