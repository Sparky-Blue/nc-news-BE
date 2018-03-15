function getEndPointDocumentation(req, res, next) {
  //res.send("hello");
  res.render("/pages/index.ejs", {}).catch(console.log);
}

module.exports = { getEndPointDocumentation };
