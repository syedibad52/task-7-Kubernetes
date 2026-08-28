const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

// backend url - this is the kubernetes service name
const BACKEND = "http://flask-backend-service:5000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// using ejs for templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// show the form
app.get("/", (req, res) => {
  res.render("index", { response: null, error: null });
});

// when user submits the form, send it to flask backend
app.post("/submit", async (req, res) => {
  try {
    const result = await axios.post(BACKEND + "/submit", {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });
    res.render("index", { response: result.data, error: null });
  } catch (err) {
    console.log("error talking to backend:", err.message);
    res.render("index", { response: null, error: "could not reach backend" });
  }
});

// health check for k8s
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("frontend running on port 3000");
});
