const devData = require('../data/development-data/index.js');
const testData = require('../data/test-data/index.js')
const seed = require('./seed.js');
const db = require('../connection.js');

const dataPointer = process.argv[2] || "dev";
const data = (dataPointer == "test") ? testData : (dataPointer == "dev") ? devData : devData;

const runSeed = (data) => {
  console.log("seeding...");
  return seed(data).then(() => db.end());
};

runSeed(data);
