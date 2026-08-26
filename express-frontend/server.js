const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// flask backend url - using kubernetes service name
const BACKEND_URL = process.env.BACKEND_URL || "http://flask-backend-service:5000";
console.log("using backend url:", BACKEND_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ejs templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// home page
app.get("/", (req, res) => {
  res.render("index", { response: null, error: null });
});

// form submit - sends to flask
app.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("form data:", name, email, message);

  try {
    const result = await axios.post(BACKEND_URL + "/submit", {
      name, email, message
    });
    console.log("backend replied:", result.data);
    res.render("index", { response: result.data, error: null });
  } catch (err) {
    console.log("backend error:", err.message);
    let errorMsg = "cant connect to backend";
    if (err.response && err.response.data) {
      errorMsg = err.response.data.error || errorMsg;
    }
    res.render("index", { response: null, error: errorMsg });
  }
});

// health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Express frontend on http://localhost:" + PORT);
});
