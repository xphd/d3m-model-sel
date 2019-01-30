"use strict";
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const serverSocket = socketIO(server, { origins: "*:*" });

console.log("Server listening 9090");
server.listen(9090);

// data preparation
// before socket communication
// path can be others, only if the dir contains files named by solution_id
let path = "./responses/getSearchSolutionsResultsResponses/";
const solutions = []; // each element is solution_id
fs.readdirSync(path).forEach(filename => {
  // filename looks like "1234-asdg-sdfd-xxx.json"
  let solutionId = filename.split(".")[0];
  const solution = {
    id: solutionId,
    pipelineSize: 0,
    score: 0
  };
  solutions.push(solution); // filename is nothing but solution_id
  // console.log(solution);
});

/*
solution={
  id: ,// solution_id
  pipelineSize: , // pipelineSize is number of primitives in pipeline
  scores: // performance metrics, for instance, F1
  // scores will be dic type, instead of a solo number
  // scores:{
    F1:

  }
}
*/

// socket begin
serverSocket.on("connection", socket => {
  socket.on("requestSolutions", () => {
    console.log("Server: requestSolutions received");

    // get score(s)
    let scoreSolutionPath = "./responses/scoreSolutionResponses/";
    let getScoreSolutionPath = "./responses/getScoreSolutionResultsResponses/";
    solutions.forEach(solution => {
      let id = solution.id;
      let filename1 = scoreSolutionPath + id + ".json";
      let tempObj = fs.readFileSync(filename1, "utf-8");

      let request_id = JSON.parse(tempObj).request_id;
      let filename2 = getScoreSolutionPath + request_id + ".json";
      let tempObj2 = fs.readFileSync(filename2, "utf-8");

      // hardcode at this moment
      let score = JSON.parse(tempObj2).scores[0].value.raw.double;

      solution.score = score;
    });

    // get pipelineSize
    let describeSolutionPath = "./responses/describeSolutionResponses/";
    solutions.forEach(solution => {
      let id = solution.id;
      let filename = describeSolutionPath + id + ".json";
      let tempObj = fs.readFileSync(filename, "utf-8");
      let size = JSON.parse(tempObj).pipeline.steps.length;
      solution.pipelineSize = size;
    });

    // get timeProduce(s)
    let produceSolutionPath = "./responses/produceSolutionResponses/";
    let getProduceSolutionPath =
      "./responses/getProduceSolutionResultsResponses/";
    solutions.forEach(solution => {
      let id = solution.id;
      let filename1 = produceSolutionPath + id + ".json";
      let tempObj = fs.readFileSync(filename1, "utf-8");

      let request_id = JSON.parse(tempObj).request_id;
      let filename2 = getProduceSolutionPath + request_id + ".json";
      let tempObj2 = fs.readFileSync(filename2, "utf-8");

      // hardcode at this moment
      let start_seconds_str = JSON.parse(tempObj2).progress.start.seconds;
      let end_seconds_str = JSON.parse(tempObj2).progress.end.seconds;

      let start_seconds = parseInt(start_seconds_str);
      let end_seconds = parseInt(end_seconds_str);

      let start_nanos = JSON.parse(tempObj2).progress.start.nanos;
      let end_nanos = JSON.parse(tempObj2).progress.end.nanos;

      let diff_seconds = end_seconds - start_seconds;
      let diff_nanos = end_nanos - start_nanos;

      let timeProduce = diff_seconds + diff_nanos * Math.pow(10, -9);

      solution.timeProduce = timeProduce;
      // console.log(timeProduce);
    });

    // get timeFit(s)
    let getFitSolutionPath = "./responses/getFitSolutionResultsResponses/";
    solutions.forEach(solution => {
      let id = solution.id;
      let filename = getFitSolutionPath + id + ".json";

      let tempObj = fs.readFileSync(filename, "utf-8");

      // hardcode at this moment
      let start_seconds_str = JSON.parse(tempObj).progress.start.seconds;
      let end_seconds_str = JSON.parse(tempObj).progress.end.seconds;

      let start_seconds = parseInt(start_seconds_str);
      let end_seconds = parseInt(end_seconds_str);

      let start_nanos = JSON.parse(tempObj).progress.start.nanos;
      let end_nanos = JSON.parse(tempObj).progress.end.nanos;

      let diff_seconds = end_seconds - start_seconds;
      let diff_nanos = end_nanos - start_nanos;

      let timeFit = diff_seconds + diff_nanos * Math.pow(10, -9);

      solution.timeFit = timeFit;
      // console.log(timeFit);
    });

    socket.emit("responseSolutions", solutions);
  });

  socket.on("requestPipeline", solutionId => {
    console.log("Server: requestPipeline, id:", solutionId);
    let pipelinePath = "./responses/describeSolutionResponses/";
    let filename = pipelinePath + solutionId + ".json";
    let pipelineStr = fs.readFileSync(filename, "utf8");
    let pipelineStrJSON = JSON.parse(pipelineStr);
    let pipeline = pipelineStrJSON["pipeline"];
    socket.emit("responsePipeline", pipeline);
  });
});
