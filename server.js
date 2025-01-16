const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

const app = express();
const HTTP_PORT = process.PORT || 3080;
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
