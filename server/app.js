const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
  // write your logging code here
  
  var log = (req.headers['user-agent']).replace(",", ";") + "," + (new Date()).toISOString() + "," + req.method + "," + req.originalUrl + "," + ((req.protocol).toUpperCase()) + "/" + (req.httpVersion) + "," + res.statusCode + '\n'
  //res.sendStatus(res.statusCode);

  // console.log((req.headers['user-agent']).replace(",",";"));
  // console.log((new Date()).toISOString());
  // console.log(req.method);
  // console.log(req.originalUrl);
  //console.log((req.protocol)+"/"+(req.httpVersion));
  //console.log(req.httpVersion);
console.log (log);

  fs.appendFile('server/log.csv', log, function (err) {
    if (err) throw err;
    next();
  });
});

app.get('/', (req, res) => {
  // write your code to respond "ok" here
  res.sendStatus(res.statusCode);
});

function csvJSON(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {

    var obj = {};
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

app.get('/logs', (req, res) => {
  // write your code to return a json object containing the log data here

  fs.readFile('server/log.csv', 'utf8', function (error, data){
    
    var logsAsJSON = csvJSON(data);
    logsAsJSON = JSON.parse(logsAsJSON);

    res.json(logsAsJSON);
  });
});

module.exports = app;

// -- -- Write the code so your server will return a JSON object with all the
// contents of the log file when users navigate to http://localhost:3000/logs

//************another method*****************
  // var parse = require('csv-parse');
  // var csvData=[];
  // fs.createReadStream('server/log.csv') //fs.createReadStream(req.file.path)
  //     .pipe(parse({delimiter: ':'}))
  //     .on('data', function(csvrow) {
  //         console.log(csvrow);
  //         //do something with csvrow
  //         csvData.push(csvrow);        
  //     })
  //     .on('end',function() {
  //       //do something with csvData
  //       console.log(csvData);
  //       res.json(csvData);  
  //     });