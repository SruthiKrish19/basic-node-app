const http = require("http");
const path = require("path");
const fs = require("fs");
const { appLogger } = require("./logger");

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile(path.join(__dirname, "views", "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>500 Server Error</h1>", "utf8");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data, "utf8");
    });
  } else if (req.url === "/users") {
    fs.readFile(path.join(__dirname, "data.json"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "500 Server Error" }), "utf8");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data, "utf8");
    });
  } else if (req.url.startsWith("/user/")) {
    const userId = req.url.split("/")[2];
    if (!userId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Bad Request: Missing user ID" }), "utf8");
      return;
    }

    fs.readFile(path.join(__dirname, "data.json"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "500 Server Error" }), "utf8");
        return;
      }

      const users = JSON.parse(data);
      const user = users.find((u) => u.id.toString() === userId);

      if (user) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user), "utf8");
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User not found" }), "utf8");
      }
    });
  } else {
    fs.readFile(path.join(__dirname, "views", "404.html"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>500 Server Error</h1>", "utf8");
        return;
      }
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(data, "utf8");
    });
  }

  appLogger(req.url);
});

server.listen(PORT, () => console.log("server is running on port", PORT));
