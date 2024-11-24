const os = require("os");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const appLogger = async (url) => {
  try {
    await fsPromises.appendFile(
      path.join(__dirname, "logs.txt"),
      `${new Date().toISOString()} \t ${url.toString()} \t ${os.userInfo().username.toString()} \n`
    );
  } catch (error) {
    console.log("Error Logging data", error);
  }
};

module.exports = { appLogger };
