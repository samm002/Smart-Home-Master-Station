const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const ruleRoutes = require("./Routes/ruleRoute");
const databaseName = "master-station";
const host = `mongodb://127.0.0.1/${databaseName}`;

app.use(express.json());
app.use("/rule", ruleRoutes);

mongoose
  .connect(host)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
