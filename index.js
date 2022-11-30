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


        app.get('/categories/:brandName', async (req, res) => {
            const brandName = req.params.brandName;
            console.log(brandName);
            const query = { brandName: brandName };
            const category = await bikeCollection.findOne(query);
            const products = await productsCollection.find(query).toArray();
            console.log(products);
            res.send([...category.products, ...products]);
        });

        //Users Post
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
            console.log(result);
        })

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const foundEmail = await usersCollection.findOne({ email });
            console.log(foundEmail);
            res.send(foundEmail);
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

        // Post Products
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });

        app.get('/products', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/advertise/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    advertisement: 'Okay'
                }
            }
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        //Getting all products
        app.get('/allproducts', async (req, res) => {
            const query = {};
            const allProducts = await productsCollection.find(query).toArray();
            res.send(allProducts);
        });

        app.get('/anik', async (req, res) => {
            let query = {
                advertisement: 'Okay'
            }
            const cursor = productsCollection.find(query);
            const advertisedproducts = await cursor.toArray();
            res.send(advertisedproducts);
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'Admin' });
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