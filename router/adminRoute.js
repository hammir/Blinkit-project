const express = require("express");
const router = express.Router();
const { adminModel } = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authAdmin = require("../Middlewares/admin");

if (
  typeof process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "DEVELOPMENT"
) {
  router.get("/create", async (req, res) => {
    try {
      let salt = await bcrypt.genSalt(10);
      let hashPass = await bcrypt.hash("admin", salt);
      ``;

      let admin = new adminModel({
        name: "Hammir",
        email: "hammirchaturvedi@gmail.com",
        password: hashPass,
        role: "admin",
      });

      await admin.save();
      let token = jwt.sign(
        { email: "hammirchaturvedi@gmail.com" },
        process.env.JWT_KEY
      );
      res.cookie("Admin_token", token);
      res.status(200).send("admin created successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error " + error);
    }
  });

  router.get("/login", (req, res) => {
    res.render("admin_login");
  });

  router.post("/login", async (req, res) => {
    let { email, password } = req.body;
    let admin = await adminModel.findOne({ email: email });

    if (!admin) {
      res.send("Admin Not Found");
    } else {
      console.log("admin from db ", admin);
      let validAdmin = await bcrypt.compare(password, admin.password);
      if (validAdmin) {
        let token = jwt.sign({ email: admin.email }, process.env.JWT_KEY);
         res.cookie("Admin_Login_Token", token);
        res.status(200).redirect("/admin/dashboard");
        console.log("Admin Logged In Successfully");
      } else {
        res.send("Invalid Password");
      }
    }
  });

  router.get("/dashboard",authAdmin ,(req, res) => {
    res.render("admin_dashboard");
  });

router.get("/logout",authAdmin, (req,res)=>{
  res.cookie("Admin_Login_Token","");
  res.redirect("/admin/login");
})


}

module.exports = router;
