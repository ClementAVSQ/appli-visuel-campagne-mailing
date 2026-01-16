const fs = require("fs")
const csv =require("csv-parser");

function parseCsvToObject(filePath) {
  return new Promise((resolve, reject) => {
    const head = [];
    const body = [];

    fs.createReadStream(filePath)
      .pipe(csv({separator:";"}))
      .on("headers", (headers) => {
        headers.forEach(h => head.push(h));
      })
      .on("data", (row) => {
        const rowValues = Object.values(row);
        body.push(rowValues);
      })
      .on("end", () => resolve({ head, body }))
      .on("error", (err) => reject(err));
  });
}

// Export correct pour CommonJS
module.exports = parseCsvToObject;
