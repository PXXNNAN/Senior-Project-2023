require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const MemoryStore = require('memorystore')(session)

//create express (node.js) application
const app = express();
app.use(session({
  secret: 'keyboard cat',
  store: new MemoryStore({
    checkPeriod: 24*60*60*1000 // prune expired entries every 24h
  }),
  resave: false,
  saveUninitialized: true,
  // cookie: { maxAge: 24*60*60*1000 }
}))

app.use(express.json(), cors());
app.use(express.urlencoded({ extended: true }));

const authen = require("./routes/authen.js");
app.use(authen);

const item = require("./routes/item.js");
app.use(item);

const staff = require("./routes/staff.js");
app.use(staff);

const borrow_history = require("./routes/borrow_history.js");
app.use(borrow_history);

const user = require("./routes/user.js");
app.use(user);

const basket = require("./routes/basket.js");
app.use(basket);

const dashboard = require("./routes/dashboard.js");
app.use(dashboard);

//Server listening
const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log("Server started on port ", port);
});