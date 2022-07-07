const devData = require('../data/development-data/index.js');
const testData = require('../data/test-data/index.js')
const seed = require('./seed.js');
const db = require('../connection.js');

const dataPointer = process.argv[2] || "dev";

const runSeed = (dataPointer) => {
  const data = (dataPointer === "dev") ? devData :
    (dataPointer === "test") ? testData : devData;
  return seed(data).then(() => db.end());
};

runSeed();
