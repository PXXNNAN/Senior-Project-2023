const express = require("express");
const req = require("express/lib/request.js");
const conn = require("../utils/dbconnect.js");

const router = express.Router();

//login
router.post("/api/login", (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const mails = email.split("@");

    if (mails[1] == 'lamduan.mfu.ac.th') {
        // student
        
        if (id == "15" || id == "13") {
            req.session.student_id = mails[0];
            req.session.fullname = name;
            res.json(
                    [
                        {
                            email: email, 
                            FullName_THAI: name,
                            Position: "",
                            Staff_ID: mails[0],
                            role_asset: 0,
                        }
                    ]
            );
        }
        else {
            res.status(400).send("Not IT student")
        }
    } else {
        // staff
        // check with db
        let sql = "SELECT Staff_ID, FullName_THAI, Position, role_asset, Building, Room FROM staff WHERE Email = ?";
        conn.query(sql, [email], (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send("Server error");
            }
            if (results.length != 1) {
                return res.status(500).send("No member");
            }
            // member
            req.session.staff_id = results[0].Staff_ID;
            req.session.fullname_thai = results[0].FullName_THAI;
            req.session.position = results[0].Position;
            req.session.role_asset = results[0].role_asset;
            req.session.Building = results[0].Building;
            req.session.Room = results[0].Room;
            console.log(results);
            res.json(results);
        });
    }
});

router.post('/api/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Cannot destroy session");
            }
            else {
                console.log(req.session);
                console.log("logout");
                res.status(200).json({ success: "true" })
            }
        });
    } catch (error) {
        res.json({success: "false", message: "Error Something wrong!", error: error})
    }
})

module.exports = router;