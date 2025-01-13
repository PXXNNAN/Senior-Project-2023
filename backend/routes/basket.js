const express = require("express");
const conn = require("../utils/dbconnect.js");

const router = express.Router();

//show all services
router.get("/api/basket", (req, res) => {
  let sql = "SELECT * FROM basket";
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
router.get("/api/basket/:id", (req, res) => {
  let sql = "SELECT * FROM basket WHERE ID =" + req.params.id;
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
router.post("/api/basket", (req, res) => {
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
    "INSERT INTO basket (Staff_ID, inventory_number, Detail) VALUES ?";
  conn.query(sql, [data.map((obj) => Object.values(obj))], (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
});

//update services   !!!!!! Cheack Again !!!!!!!
router.put("/api/basket/:id", (req, res) => {
  let sql =
    "UPDATE basket SET basket_id='" +
    req.body.basket_id +
    "', Staff_ID='" +
    req.body.Staff_ID +
    "', inventory_number='" +
    req.body.inventory_number +
    "', status='" +
    req.body.status +
    "', Date_start='" +
    req.body.Date_start +
    "', Date_End='" +
    req.body.Date_End +
    "', Detail='" +
    req.body.Detail +
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
router.delete("/api/basket/:id", (req, res) => {
  let sql = "DELETE FROM basket WHERE basket_id =" + req.params.id;
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