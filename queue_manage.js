const fs = require('fs');

try {
    var qGen = JSON.parse(fs.readFileSync('files/generate-queue-list.json'));
} catch (error) {
    var qGen = {
        "qGen":[]
    };
}

// var readFile =fs.readFileSync('files/generate-queue-list.json');
// var readFile_updateQ =fs.readFileSync('files/update-genStatus-db-list.json');
// var qGen = (readFile.toString().trim().length > 3 ? JSON.parse(readFile) : {"qGen":[]} );
// var qUpdate = (readFile.toString().trim().length > 3 ? JSON.parse(readFile_updateQ) :  {"qUpdate":[]} );


module.exports = {
    qGen : qGen,
}

