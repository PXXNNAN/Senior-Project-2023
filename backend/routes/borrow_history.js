const express = require("express");
const conn = require("../utils/dbconnect.js");

const router = express.Router();

//show all services
router.get("/api/borrow_history", (req, res) => {
  const { location, room } = req.query
  let sql = 'SELECT borrow_history.* FROM borrow_history INNER JOIN item ON borrow_history.inventory_number = item.Inventory_Number WHERE borrow_history.Status = 0 && item.Location = ? && item.Room = ?'
  // let sql = "SELECT * FROM borrow_history WHERE Status = 0 ORDER BY borrow_id DESC;";
  conn.query(sql, [location, room], (err, results) => {
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





//show all services
router.get("/api/borrow_history1", (req, res) => {
  const { location, room } = req.query
  let sql = 'SELECT borrow_history.* FROM borrow_history INNER JOIN item ON borrow_history.inventory_number = item.Inventory_Number WHERE borrow_history.Status = 1 && item.Location = ? && item.Room = ? ORDER BY borrow_id DESC';
  conn.query(sql, [location, room], (err, results) => {
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

//show all services
router.get("/api/history", (req, res) => {
  let sql = "SELECT * FROM borrow_history ORDER BY borrow_id DESC;";
  conn.query(sql, (err, results) => {
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
router.get("/api/borrow_history/:id", (req, res) => {
  let sql = "SELECT * FROM borrow_history WHERE ID =" + req.params.id;
  conn.query(sql, (err, results) => {
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
router.get("/api/Accept", (req, res) => {
  let sql = "SELECT * FROM borrow_history WHERE Status = 4 ORDER BY borrow_id DESC";
  conn.query(sql, (err, results) => {
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
router.post("/api/borrow_history", (req, res) => {


  const { data } = req.body;
  console.log(data);

  let sql =
    "INSERT INTO borrow_history (Staff_ID, FullName_THAI, inventory_number, Date_start, Date_End, Detail) VALUES ?";
  let update = "UPDATE item SET Borrow_Status = 0 WHERE inventory_number IN ?";
  conn.query(sql, [data.map((obj) => Object.values(obj))], (err, results) => {
    if (err) throw err;

    conn.query(
      update,
      [[data.flatMap((obj) => Object.values(obj))]],
      (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
        return;
      }
    );
  });
});

//update borrow status
router.post("/api/borrow_history/update", (req, res) => {
  const { newStatus, borrowId, inventoryNumber, updateItem = false } = req.body;

  let updateBorrowStatus =
    "UPDATE borrow_history SET Status = ? WHERE borrow_id = ?";
  let updateItemStatus =
    "UPDATE item SET Status = ? WHERE inventory_number = ?";
  conn.query(updateBorrowStatus, [newStatus, borrowId], (err, results) => {
    if (err) throw err;

    if ((!!updateItem, !!inventoryNumber)) {
      conn.query(
        updateItemStatus,
        [newStatus, inventoryNumber],
        (err, results) => {
          if (err) throw err;
          res.status(200).json(results);
          return;
        }
      );
    }

    res.status(200).json(results);
    return;
  });
});

//update borrow status
router.post("/api/borrow_history/update_borrow_status_item", (req, res) => {
  const { newStatus, inventoryNumber, updateItem = false } = req.body;

  let updateBorrowStatus =
    "UPDATE item SET Borrow_Status = ? WHERE inventory_number = ?";
  let updateItemStatus =
    "UPDATE item SET Status = ? WHERE inventory_number = ?";
  console.log(newStatus);
  console.log(inventoryNumber);
  conn.query(updateBorrowStatus, [newStatus, inventoryNumber], (err, results) => {
    if (err) throw err;

    if ((!!updateItem && !!inventoryNumber)) {
      conn.query(
        updateItemStatus,
        [newStatus, inventoryNumber],
        (err, results) => {
          if (err) throw err;
          res.status(200).json(results);
          return;
        }
      );
    } else {
      res.status(200).json(results);
      return;
    }
  });
});


//update services   !!!!!! Cheack Again !!!!!!!
router.put("/api/borrow_history/:id", (req, res) => {
  let sql =
    "UPDATE borrow_history SET Staff_ID='" +
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
    " WHERE borrow_id  =" +
    req.params.id;
  conn.query(sql, (err, results) => {
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
router.delete("/api/borrow_history/:id", (req, res) => {
  let sql = "DELETE FROM borrow_history WHERE borrow_id =" + req.params.id;
  conn.query(sql, (err, results) => {
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

//get cout 
router.get('/api/count_inventory', (req, res) => {
  let sql = "SELECT inventory_number, COUNT(inventory_number) count_inventory FROM borrow_history GROUP BY inventory_number";
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({
      "status": 200,
      "error": null,
      "response": results
    }));
  });
});

//get room 
router.get('/api/room', (req, res) => {
  let sql = "select borrow_history.*, item.Room from borrow_history borrow_history, item item where borrow_history.inventory_number = item.Inventory_Number AND item.Year = 2564";
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({
      "status": 200,
      "error": null,
      "response": results
    }));
  });
});

router.get('/api/status0', (req, res) => {
  let sql = "SELECT COUNT(Status) STATUS0 FROM borrow_history WHERE Status = 0;";
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({
      "status": 200,
      "error": null,
      "response": results
    }));
  });
});

module.exports = router;
// Delivered Status
router.get('/api/status4', (req, res) => {
  let sql = "SELECT * FROM borrow_history WHERE Status = 4 ORDER BY borrow_id DESC";
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({
      "status": 200,
      "error": null,
      "response": results
    }));
  });
});

module.exports = router;