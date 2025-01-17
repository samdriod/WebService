
/********************************************************************************
* BTI425 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Samip Karki    Student ID: 141867234      Date: 2025/01/15
*
* Published URL: https://web-service-green.vercel.app/
*
********************************************************************************/
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ListingsDB = require("./modules/listingsDB");
const db = new ListingsDB();

const app = express();
const HTTP_PORT = process.env.PORT || 3080;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({status: "Service Working"});
});

app.post("/api/listings", async (req,res) => {
  try {
  let lst = await db.addNewListing(req.body);
  res.status(201).json(lst);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.get("/api/listings", async (req, res) => {
  try {
    let lsts = await db.getAllListings(req.query.page, req.query.perPage, req.query.name);
    res.status(200).json(lsts);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.get("/api/listings/:id", async (req,res) => {
  try {
    let lsts = await db.getListingById(req.params.id);
    res.status(200).json(lsts);
  } catch (err) {
    res.status(500).json({error: err.message})
  }
});

app.put("/api/listings/:id", async (req,res) => {
  try {
    let lst = await db.updateListingById(req.data, req.params.id);
    res.status(200).json(lst);
  } catch (err) {
    res.status(500).json({error: err.message})
  }
});

app.delete("/api/listings/:id", async (req,res) => {
  try {
    let lst = await db.deleteListingById(req.params.id);
    res.status(204).json(lst);
  } catch (err) {
    res.status(500).json({error: err.message})
  }
});

app.use((req, res, next) => {
  res.status(404).send({error: "Not Found"});
  next();
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
