const express = require("express");
const conn = require("../utils/dbconnect.js");

const router = express.Router();

//show all services
router.get('/api/item', (req, res) => {
    let sql = "SELECT * FROM item";
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//filter services with location and room
router.get('/api/item/filter', (req, res) => {
    const {year, id} = req.query
    try {
        let sql = "SELECT item.* FROM item INNER JOIN staff ON staff.Building = item.Location && staff.Room = item.Room WHERE staff.Staff_ID  = ? && item.Year = ?";
        conn.query(sql, [id, year], (err, results) => {
            if (err) throw err;
            res.send(JSON.stringify({
                "status": 200,
                "error": null,
                "response": results
            }));
        });
    } catch (error) {
        res.json({
            Success: "false",
            Error: error
        })
    }
});

//show single services
router.get('/api/item/:id', (req, res) => {
    let sql = "SELECT * FROM item WHERE Year =" + req.params.id;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//add new services
router.post('/api/item', (req, res) => {
    let data = {
        Asset_Number: req.body.Asset_Number,
        Year: req.body.Year,
        Inventory_Number: req.body.Inventory_Number,
        Email_Committee: req.body.Email_Committee,
        Email_Importer: req.body.Email_Importer,
        Asset_Description: req.body.Asset_Description,
        Model: req.body.Model,
        Serial: req.body.Serial,
        Location: req.body.Location,
        Room: req.body.Room,
        Received_date: req.body.Received_date,
        Original_value: req.body.Original_value,
        Cost_center: req.body.Cost_center,
        Department: req.body.Department,
        Date_Upload: req.body.Date_Upload,
        Vendor_name: req.body.Vendor_name,
        Status: req.body.status,
        Date_scan: req.body.Date_scan,
        Takepicture: req.body.Takepicture
    };
    let sql = "INSERT INTO item SET ?";
    conn.query(sql, data, (err, results) => {
        if (err) throw err;
        //results.message = "1 row inserted.";
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//update services   !!!!!! Cheack Again !!!!!!!
router.put('/api/item/:id', (req, res) => {
    let sql = "UPDATE item SET Asset_Number='" + req.body.Asset_Number +
        "', Year '" + req.body.Year +
        "', Email_Committee='" + req.body.Email_Committee +
        "', Email_Importer='" + req.body.Email_Importer +
        "', Asset_Description='" + req.body.Asset_Description +
        "', Model='" + req.body.Model +
        "', Serial='" + req.body.Serial +
        "', Location=" + req.body.Location +
        "', Room='" + req.body.Room +
        "', Received_date='" + req.body.Received_date +
        "', Original_value=" + req.body.Original_value +
        "', Cost_center='" + req.body.Cost_center +
        "', Department='" + req.body.Department +
        "', Date_Upload=" + req.body.Date_Upload +
        "', Vendor_name='" + req.body.Vendor_name +
        "', Status='" + req.body.Status +
        "', Date_scan='" + req.body.Date_scan +
        "', Takepicture=" + req.body.Takepicture +
        " WHERE Inventory_Number=" + req.params.id;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//Delete services
router.delete('/api/item/update', (req, res) => {
    let sql = "DELETE FROM item WHERE Inventory_Number=" + req.params.id;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});
// Disable Borrow_Status
router.post('/api/item/Disablestatus/:id', (req, res) => {
    const id = req.params.id;
    let sql = "UPDATE item SET Borrow_Status = 6 WHERE inventory_number = ?";
    conn.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

// Enable Borrow_Status
router.post('/api/item/Enablestatus/:id', (req, res) => {
    const id = req.params.id;
    let sql = "UPDATE item SET Borrow_Status = 1 WHERE inventory_number = ?";
    conn.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//update borrow status
router.post("/api/item/update_borrow_status_item", (req, res) => {
    const { newStatus, inventoryNumber, updateItem = false } = req.body;

    let updateBorrowStatus =
        "UPDATE item SET Borrow_Status = ? WHERE inventory_number = ?";
    console.log(newStatus);
    console.log(inventoryNumber);
    conn.query(updateBorrowStatus, [newStatus, inventoryNumber], (err, results) => {
        if (err) throw err;

        if ((!!updateItem && !!inventoryNumber)) {
            conn.query(
                updateBorrowStatus,
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

module.exports = router;