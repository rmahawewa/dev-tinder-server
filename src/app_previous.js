console.log("Starting a new project"); 

const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth.js");
const app = express();

// Middleware to parse JSON bodies.  This is CRUCIAL for POST/PUT requests.
app.use(express.json()); // Add this line

// app.use("/admin", (req, res, next) => {
//     console.log("Admin auth is getting checked"); 
//     const token = "abc";
//     const isAdminAuthorized = token === "abcd";
//     if(!isAdminAuthorized) {
//         res.status(401).send("Unauthorized request");
//     } else {
//         next();
//     }
// });

// app.use("/admin", adminAuth);

// app.get("/user",userAuth, (req, res) => {
//     res.send("User data sent");
// });

// app.get("/admin/getAllData", (req, res) => {
//     res.send("All data sent");
// });

// app.get("/admin/deleteUser", (req, res) => {
//     res.send("deleted a user");
// });

app.use("/", (err, req, res, next) => {
    console.log("Error handler 1");
    if(err){
        res.status(500).send("something went wrong 0");
    }
});

app.get("/getUserData", (req, res) => {
    try {
        //Logic of DB call and get user data

        throw new Error("this is a random error");
        res.send("User data sent");
    } catch {
        res.status(500).send("something went wrong 1");
    }
    
});

app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("something went wrong 2");
    }
});

app.listen(3000, () => {
    console.log("Server is listening on the port 3000");
});