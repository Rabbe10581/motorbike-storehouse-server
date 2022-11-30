const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const usersCollection = client.db('bikeResale').collection('users');
        const ordersCollection = client.db('bikeResale').collection('orders');
        const productsCollection = client.db('bikeResale').collection('addedProducts');

        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = bikeCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })


        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await bikeCollection.findOne(query);
            res.send(products);
        });

        //Users Post
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
            console.log(result);
        })

        //orders post
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log(order);
            const query = {
                appointmentDate: order.appointmentDate,
                email: order.email,
                treatment: order.treatment
            }
            const alreadyBooked = await ordersCollection.find(query).toArray();
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        // get Orders
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders);
        });

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const orders = await ordersCollection.findOne(query);
            res.send(orders);
        })

        //
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });


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