const express = require("express");
const app = express();
const routes = require("./routes/routes");
const connectDB = require("./mongodb/connect");
const reportinfo = require("./models/reportinfo");
const bodyParser = require("body-parser");
const path=require("path")
const staticPath=path.join(__dirname,"./public")
require("dotenv").config();


//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(staticPath));

app.use("/api/report", routes);

const mongodb = process.env.MONGO_URL;
const port = process.env.PORT;
const start = async () => {
  try {
    await connectDB(mongodb);
    app.listen(port, console.log(`Server is listening to port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();


//Export the Express API
module.exports=app