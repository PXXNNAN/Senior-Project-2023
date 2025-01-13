const express = require("express");
const conn = require("../utils/dbconnect.js");

const router = express.Router();

//show all services
router.get('/api/staff', (req, res) => {
    let sql = "SELECT * FROM staff";
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//show single services
router.get('/api/year_user/:id', (req, res) => {
    let sql = "SELECT * FROM staff WHERE Staff_ID =" + req.params.id;
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
router.post('/api/staff', (req, res) => {
    let data = {
        No: req.body.No,
        Staff_ID: req.body.Staff_ID,
        FullName_THAI: req.body.FullName_THAI,
        FullName_ENGLISH: req.body.FullName_ENGLISH,
        ROLE: req.body.ROLE,
        Position: req.body.Position,
        Email: req.body.Email
    };
    let sql = "INSERT INTO staff SET ?";
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

//update borrow status
router.post("/api/staff/update", (req, res) => {
    try {
        const { Building, FullName_THAI, Room } = req.body;
        let updateBuild_Room = "UPDATE staff SET Building = ?, Room =? WHERE FullName_THAI = ?";
        conn.query(updateBuild_Room, [Building, Room, FullName_THAI], (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (error) {
        res.json({
            Success : "false",
            Error: error
        })
    }
});









//update services   !!!!!! Cheack Again !!!!!!!
router.put('/api/staff/:id', (req, res) => {
    let sql = "UPDATE year_user SET No='" + req.body.No +
        "', FullName_THAI='" + req.body.FullName_THAI +
        "', FullName_ENGLISH='" + req.body.FullName_ENGLISH +
        "', ROLE='" + req.body.ROLE +
        "', Position='" + req.body.Position +
        "', Email=" + req.body.Email +
        " WHERE Staff_ID =" + req.params.id;
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
router.delete('/api/staff/:id', (req, res) => {
    let sql = "DELETE FROM staff WHERE Staff_ID=" + req.params.id;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//Role staff = 1 
router.get('/api/role_staff', (req, res) => {
    let sql = "SELECT * FROM staff WHERE role_asset = 1";
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//Role Lecturer = 3
router.get('/api/role_3', (req, res) => {
    let sql = "SELECT * FROM staff WHERE role_asset = 3";
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});

//Postion = TA
router.get('/api/TA', (req, res) => {
    let sql = "SELECT * FROM staff WHERE Position = 'Computer Specialist'";
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