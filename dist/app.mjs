import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
import sharp from "sharp";
import compression from "compression";
import axios from "axios";
import dotenv from "dotenv";
const router$1 = express();
router$1.get("/hello", function(req, res) {
  res.send("Hello user!!!");
});
router$1.get("/translate", async function(req, res) {
  const headers = { ...req.headers };
  delete headers.host;
  const resp = await axios.get("https://translate.yandex.ru/?source_lang=en&target_lang=ru&text=hello new day", { headers });
  res.send({ data: resp.data, headers: req.headers });
});
router$1.post("/data", (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.send({ ok: "server" });
});
router$1.get("/hello/:name/day/:day", function(req, res) {
  res.send(
    `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      h1 {
        color:red;
      }
    </style>
  </head>
  <body>
    <h1>Привет ${req.params.name}! Поздравляю с ${req.params.day}</h1>
    <p id=ms>${req.timeStamp}</p>
    <script>
      console.log(Date.now() - +ms.innerText)
    <\/script>
  </body>
  </html>`
  );
});
router$1.get("/:any", function(req, res) {
  res.send(
    `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      h1 {
        color:red;
      }
    </style>
  </head>
  <body>
    <h1>${req.params.any} такого адреса не существует</h1>
    <p>timestamp ${req.timeStamp}</p>
  </body>
  </html>`
  );
});
const router = express();
router.get("/", function(req, res) {
  res.send("Welcome from api");
});
dotenv.config();
const app = express();
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static/img/tmp");
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage: storageConfig });
app.use(cors());
app.use(upload.any());
app.use(bodyParser.urlencoded({ extended: false }));
const addTimestamp = () => {
  return (req, res, next) => {
    req.timeStamp = Date.now();
    next();
  };
};
app.use(addTimestamp());
const resizeImages = async (req, res, next) => {
  if (!req.files)
    return next();
  try {
    req.body.images = [];
    await Promise.all(
      // @ts-ignore
      req.files.map(async (file) => {
        const filename = Date.now() + "-" + file.originalname.match(/\d?[a-zA-Z.-]?/g).join("").replace(/\..+$/, "");
        const newFilename = `${filename}.webp`;
        await sharp(file.path).resize({ width: 1050 }).webp().toFile(`static/img/desktop/${newFilename}`);
        await sharp(file.path).resize({ width: 720 }).webp().toFile(`static/img/tablet/${newFilename}`);
        await sharp(file.path).resize({ width: 380 }).webp().toFile(`static/img/mobile/${newFilename}`);
        await sharp(file.path).resize({ width: 200 }).webp({ quality: 10 }).toFile(`static/img/lazy/${newFilename}`);
        fs.unlinkSync(file.path);
        req.body.images.push({ newName: newFilename, originalName: file.originalname });
      })
    );
  } catch (e) {
    console.log(e);
  }
  next();
};
app.use(resizeImages);
app.use(bodyParser.json());
app.use(compression({ strategy: 3 }));
app.use(express.static("static"));
app.use(express.static("static"));
app.use("/api", router);
app.use(router$1);
app.listen(3001);
const viteNodeApp = app;
export {
  viteNodeApp
};
