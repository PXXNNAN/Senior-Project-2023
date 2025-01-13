const express = require("express");
const conn = require("../utils/dbconnect.js");

const router = express.Router();

//show all services
router.get("/api/user", (req, res) => {
  let sql = "SELECT * FROM user";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(
      JSON.stringify({
        status: 200,
        error: null,
        response: results,
      })
    );
  });
});

//show single services
router.get("/api/user/:id", (req, res) => {
  let sql = "SELECT * FROM user WHERE ID =" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(
      JSON.stringify({
        status: 200,
        error: null,
        response: results,
      })
    );
  });
});

//add new services
router.post("/api/user", (req, res) => {
  // let data = {
  //     borrow_id : req.body.borrow_id ,
  //     Staff_ID : req.body.Staff_ID,
  //     Staff_ID : req.body.Staff_ID,
  //     inventory_number : req.body.inventory_number,
  //     status : req.body.status,
  //     Date_start : req.body.Date_start,
  //     Date_End : req.body.Date_End,
  //     Detail : req.body.Detail
  // };

  const { data } = req.body;

  let sql =
    "INSERT INTO user (No, ID, FullName_THAI, Position_Thai, Position_ENG, Email) VALUES ?";
  conn.query(sql, [data.map((obj) => Object.values(obj))], (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
});

//update services   !!!!!! Cheack Again !!!!!!!
router.put("/api/user/:id", (req, res) => {
  let sql =
    "UPDATE user SET ID='" +
    req.body.basket_ID +
    "', FullName_THAI='" +
    req.body.FullName_THAI +
    "', Position_Thai='" +
    req.body.Position_Thai +
    "', Position_ENG='" +
    req.body.Position_ENG +
    "', Email='" +
    req.body.Email +
    " WHERE ID =" +
    req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(
      JSON.stringify({
        status: 200,
        error: null,
        response: results,
      })
    );
  });
});

//Delete services
router.delete("/api/user/:id", (req, res) => {
  let sql = "DELETE FROM user WHERE ID =" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(
      JSON.stringify({
        status: 200,
        error: null,
        response: results,
      })
    );
  });
});

module.exports = router;