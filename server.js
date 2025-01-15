const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.PORT || 3080
app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    console.log(`We are live on ${PORT}`)
})
