import express from "express";
const app = express();
app.get("/", (req, res) => {
  res.send("Cry me a river");
});
app.listen(3e3);
const viteNodeApp = app;
export {
  viteNodeApp
};
