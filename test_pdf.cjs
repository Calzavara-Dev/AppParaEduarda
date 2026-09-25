const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('banco/3.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text.substring(0, 1500));
}).catch(console.error);
