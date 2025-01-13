const express = require("express");
const conn = require("../utils/dbconnect.js");
const { route } = require("./authen.js");

const router = express.Router();

//get Status 
router.get('/api/countstatus/', (req, res) => {
    let sql = "SELECT Status, COUNT(Status) Count_Item FROM item GROUP BY Borrow_Status;";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

// Count inventory borrow
router.get('/api/countborrow', (req, res) => {
    let sql = "SELECT inventory_number, COUNT(Status) Count_Borrow FROM borrow_history GROUP BY Status;";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

// Count inventory 
router.get('/api/countinventory', (req, res) => {
    let sql = "SELECT inventory_number, COUNT(inventory_number) Count_Item FROM borrow_history GROUP BY inventory_number;";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

// Count item by date
router.get('/api/countbydate', (req, res) => {
    let sql = "SELECT Date_start, COUNT(inventory_number) COUNT_Inventory_number FROM borrow_history GROUP by Date_start;;";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

// Count location
router.get('/api/countlocation', (req, res) => {
    let sql = "SELECT Location, Borrow_Status, Room, borrow_id, COUNT(Location) Count_Location FROM borrow_history, item WHERE borrow_history.inventory_number = item.Inventory_Number GROUP BY Location DESC;";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//Count item all
router.get('/api/countallinven', (req, res) => {
    let sql = "SELECT inventory_number, COUNT(inventory_number) Count_inven FROM borrow_history GROUP BY inventory_number";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

router.get('/api/date', (req, res) => {
    const { Date_start, Date_End = false } = req.body;

    let sql = "SELECT * FROM borrow_history WHERE Date_start AND Date_End BETWEEN Date_start= ?  AND Date_End = ?";
    console.log(Date_start);
    console.log(Date_End);
    let query = conn.query(sql,[Date_start,Date_End] ,(err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});



module.exports = router;