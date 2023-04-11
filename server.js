import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import connectDB from "./db.js";
import { Users, Wishlists } from './models.js';

const app = express();

// connect database
connectDB();

// setup express middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

function getProducts() {
  const dummyProductDataPath = path.resolve(process.cwd(), 'products.json');
  const products = fs.readFileSync(dummyProductDataPath, {
    encoding: "utf-8"
  });

  return JSON.parse(products);
}

// get users
app.get('/', async (_, res) => {
  const users = await Users.find().populate('wishlist');

  res.json({
    users
  })
});

// regis new user
app.post('/', async (req, res) => {
  const { name, email, password, username } = req.body;

  const newUser = new Users({
    name,
    email,
    password,
    username
  });
  const isSaved = await newUser.save();

  if (isSaved) {
    res.send("Success!");
    return;
  }

  res.send("Error!");
});

// get product dummy
app.get('/products', (_, res) => {
  const products = getProducts();

  res.json(products);
});

// add product to wishlist
app.post('/products', async (req, res) => {
  const { product_id, user_id } = req.body;
  
  if (!product_id || !user_id) {
    res.send("Missing required fields");
    return;
  }

  const product = getProducts()?.products.find(({ id }) => id === product_id) ?? null;

  if (product) {
    let wishProduct = null;
    const isProductAlreadyInDB = !!await Wishlists.findOne({ product_id });

    if (isProductAlreadyInDB) {
      wishProduct = await Wishlists.findOne({ product_id });
    } else {
      wishProduct = new Wishlists({
        product_id: product.id,
        product_name: product.name,
        categories: product.categories,
        unit_price: product.price
      });

      // save product to wishlist collection
      await wishProduct.save();
    }

    const user = await Users.findById(user_id);

    if (!user) {
      res.send("User not found!");
      return;
    }

    user.wishlist.push(wishProduct);
    user.save();

    res.send("Success adding the product to your wishlist!");
    return;
  }

  res.send("Error!");
})

app.listen(8080, () => {
  console.log("Server running on port 8080");
})