const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

const { spawn } = require("child_process");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.render("index", { result: " " });
});

app.post("/", upload.single("file"), (req, res) => {
  const fileName = "./uploads/" + req.file.originalname;
  const extension = path.extname(fileName);
  console.log(extension);
  var dataToSend;
  var python;
  if (extension === ".jpeg" || extension === ".jpg" || extension === ".png") {
    python = spawn("python", ["./scripts/text.py", fileName]); //for images of format jpg, jpeg, png
  } else if (extension === ".pdf") {
    python = spawn("python", ["./scripts/pdftoword.py", fileName]); //for pdf
    // python = spawn("python", ["./scripts/pdftowordocr.py", fileName]); //for pdf using ocr
  } else if (extension === ".docx") {
    python = spawn("python", ["./scripts/doc.py", fileName]); //for docx
  } else if (extension === ".xls" || extension === ".xlsx") {
    python = spawn("python", ["./scripts/excel.py", fileName]);
  }
  python.stdout.on("data", function (data) {
    dataToSend = data.toString();
    // console.log(dataToSend);
  });

  python.on("close", (code) => {
    res.render("index", { result: dataToSend });
  });
});

const server = app.listen(3000, () => {
  console.log("Server started on port 3000");
});

server.timeout = 300000;
