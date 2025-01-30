const express = require('express')
const database = require('./Src/Config/db') 
const router = require('./Src/Route\'s/Route')
var cors = require('cors')
const app = express()
app.use(express.json())  
const port = 3000
app.use(cors())
// const fs = require('fs')
const path = require('path')

app.use("/api/v1/",router)
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

database()


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})