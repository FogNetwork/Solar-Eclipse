const express = require('express');
const app = express();
const Eclipse = require("./lib")
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

app.use(express.static("public", {
  extensions: ['html']
}));

const test = new Eclipse({
  prefix: '/service/'
})

app.use((req, res) => {
  if (req.url.startsWith(test.prefix)) {
    test.request(req, res);
  }
});

app.listen(port, () => {
  console.log('Server started');
});