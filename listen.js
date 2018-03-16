process.env.NODE_ENV = process.env.NODE_ENV || "development";
const app = require("./app");
const PORT =
  process.env.NODE_ENV === "production"
    ? process.env.PORT
    : require("./config/index").PORT[process.env.NODE_ENV];

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
