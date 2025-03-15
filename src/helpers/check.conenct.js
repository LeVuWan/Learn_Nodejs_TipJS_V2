const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

//constand
const _SECONDS = 5000;

//Count Connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections::${numConnection}`);
};

//Check overload connect

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsege = process.memoryUsage().rss;
    //Example maximum number of connections based on number of cores
    const maxConnections = numCores * 10;

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usege:: ${memoryUsege / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log("Connection overload dectected");
    }
  }, _SECONDS); //Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload
};
