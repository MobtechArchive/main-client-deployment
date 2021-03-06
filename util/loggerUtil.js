'use strict';

const {createLogger} = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const telepodDetails = app_require('telepod_details');
const dbUtil = app_require('util/DBUtil.js');
const path = require('path');
var Q = require('q');

var dt = new Date();
var transport = new (DailyRotateFile)({
  filename: telepodDetails.serverName +'-%DATE%.log',
  dirname: path.join(__dirname, '../logs'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m'
});

const logger = createLogger({
  transports: [
    transport
  ]
});

exports.log = function(status,statusOBJ)
{
  logger.log(status,statusOBJ);
}

exports.logErrorReport = function(errStatus,functionToLog,etcJson)
{
  dt = new Date();
  var time = dt.toLocaleTimeString('en-US',{"timeZone":"Asia/Singapore"});
  var day = dt.toLocaleDateString('en-US',{"timeZone":"Asia/Singapore"});

  return ({"timeStamp":day+" "+time,"status":errStatus,"function":functionToLog,"etc":etcJson});
}

exports.logAPICall = function(ipToLog,functionToLog,etcJson,userId)
{
  dt = new Date();
  var time = dt.toLocaleTimeString('en-US',{"timeZone":"Asia/Singapore"});
  var day = dt.toLocaleDateString('en-US',{"timeZone":"Asia/Singapore"});

  logger.log("info",{"timeStamp":day+" "+time,"ipAddress":ipToLog,"uid":userId,"function":functionToLog,"etc":etcJson});
}

exports.catchFunc = function(ipToLog,statusToLog,functionToLog,resOBJ,code,returnMessage){
  dt = new Date();
  var time = dt.toLocaleTimeString('en-US',{"timeZone":"Asia/Singapore"});
  var day = dt.toLocaleDateString('en-US',{"timeZone":"Asia/Singapore"});
  var winstonLogStatus = (code >= 200 && code <= 299) ? "info":"error";
  logger.log(winstonLogStatus,{"timeStamp":day+" "+time,"ipAddress":ipToLog,"status":statusToLog,"function":functionToLog,"etc":returnMessage});

  if(code == 204)
  {
    resOBJ.status(code).send();
  }
  else {
    resOBJ.status(code).send({
        status: statusToLog,
        message: returnMessage
    });
  }
}

exports.catchFunc2 = function(ipToLog,statusToLog,functionToLog,UITitle,UIBody,resOBJ,code,returnMessage){
  dt = new Date();
  var time = dt.toLocaleTimeString('en-US',{"timeZone":"Asia/Singapore"});
  var day = dt.toLocaleDateString('en-US',{"timeZone":"Asia/Singapore"});
  var winstonLogStatus = (code >= 200 && code <= 299) ? "info":"error";
  logger.log(winstonLogStatus,{"timeStamp":day+" "+time,"ipAddress":ipToLog,"status":statusToLog,"function":functionToLog,"etc":returnMessage});

  if(code == 204)
  {
    resOBJ.status(code).send();
  }
  else {
    resOBJ.status(code).send({
        status: statusToLog,
        message: returnMessage,
        title: UITitle,
        body: UIBody
    });
  }
}
