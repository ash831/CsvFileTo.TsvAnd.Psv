const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
app.use(cors());
var upload = multer({ dest: "../public/uploads/" });
var csv = require("csv-parser");
var fs = require("fs");
const readline = require("readline");

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (req.file) {
      async function processLineByLine() {
        const fileStream = fs.createReadStream(req.file.path);

        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        });
       
        var writer = fs.createWriteStream("ashwin.tsv");
        for await (const line of rl) {
          let newaline=line.replace(/(?!\B"[^"]*),(?![^"]*"\B)/g,'\t').replace(/"/g,"\t")
      //  const   newaline = line.replace( / ,/g, '   ');
          console.log(`${newaline}`);
          // let writer = fs.createWriteStream("ashwin.tsv");
            writer.write(newaline);
          
         
        }
      }

      processLineByLine();

      res.status(200).send({
        status: true,
        data:newaline,
      });
    } else {
      res.status(400).send({
        status: false,
        data: "File Not Found :(",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(7000, () => console.log("Server Running..."));