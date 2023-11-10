const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.dqsrrse.mongodb.net/?retryWrites=true&w=majority`
  ;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const AssignmentDB = client.db("AssignmentDB").collection("CreatedAssignments");

    app.get('/allAssignments', async (req, res) => {
      const projection = { title: 1, thumbnail: 1 }
      const assignments = await AssignmentDB.find().project(projection).toArray()
      res.send(assignments)
    })

    app.get('/:id', async (req, res) => {
      const _id = req.params.id
      const selectedAssignment = AssignmentDB.find({ _id: new ObjectId(id) })
      res.send(selectedAssignment)
    })

    app.post('/addAssignment', async (req, res) => {
      const newProduct = req.body
      const result = await AssignmentDB.insertOne(newProduct);
      res.send(result)

    })

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;

      const { title, thumbnail, marks, difficulty, description, dueDate } = req.body
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          title: title,
          marks: marks,
          description: description,
          difficulty: difficulty,
          dueDate: dueDate,
          thumbnail: thumbnail
        },
      };

      const result = await AssignmentDB.updateOne(query, updateDoc);
      res.send(result)

    })

    app.delete('/:id', async (req, res) => {

      const id = req.params.id;
      const result = await AssignmentDB.deleteOne({ _id: new ObjectId(id) })

      res.send(result)

    })









    // const Cart = client.db("CartDB").collection("CartItems");

    // app.get('/allproducts', async (req, res) => {
    //   const pageNumber=parseInt(req.query.page)
    //   const projection = { name:1,price:1,image:1,brandName:1 };
    //   const products = await ProductsDB.find().skip(pageNumber*4).limit(4).project(projection).toArray()
    //   res.send(products)
    // });


    // app.get('/cart', verifyToken, async (req, res) => {
    //   console.log(req.user)
    //   let query = {}
    //   if (req.query?.email) {
    //     query = { email: req.query.email }
    //   }
    //   if (req.user.email != query.email) return res.send('Unauthorized Access')
    //   const cursor = Cart.find();
    //   const cartItems = await cursor.toArray();
    //   res.send(cartItems);

    // });


    // app.get('/brandPage/:brand', async (req, res) => {
    //   const brand = req.params.brand;
    //   const products = await ProductsDB.find({ brandName: brand }).toArray();
    //   res.send(products)
    // })

    // app.get('/:name', async (req, res) => {
    //   const name = req.params.name;
    //   const product = await ProductsDB.findOne({ name: name });
    //   res.send(product)
    // })

    // app.get('/update/:name', async (req, res) => {
    //   const name = req.params.name;
    //   const product = await ProductsDB.findOne({ name: name });
    //   res.send(product)
    // })
    // // ///////jwt

    // app.post('/jwt', async (req, res) => {
    //   const user = req.body
    //   const token = jwt.sign(user, process.env.Access_Token, { expiresIn: '1h' })
    //   res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: false,

    //   })
    //   res.send({ success: true })

    // })

    // // /////////////////







    // app.post('/addtoCart', async (req, res) => {
    //   const newProduct = req.body

    //   const result = await Cart.insertOne(newProduct);
    //   res.send(result)

    // })




    // app.post('/update/:id', async (req, res) => {
    //   const newProduct = req.body
    //   const id = req.params.id
    //   const query = { _id: new ObjectId(id) }
    //   const result = await Cart.insertOne(newProduct);
    //   res.send(result)

    // })



    // app.delete('/:name', async (req, res) => {

    //   const name = req.params.name;
    //   const query = { name: name }
    //   const result = await Cart.deleteOne(query);
    //   res.send(result)

    // })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }


}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Connection to the server is working.');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});