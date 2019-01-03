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

    socket.emit("responseSolutions", solutions);
  });

  socket.on("requestPipeline", solutionId => {
    console.log("Server: requestPipeline: ", solutionId);
    let pipelinePath = "./responses/describeSolutionResponses/";
    let filename = pipelinePath + solutionId + ".json";
    let pipelineStr = fs.readFileSync(filename, "utf8");
    let pipelineStrJSON = JSON.parse(pipelineStr);
    let pipeline = pipelineStrJSON["pipeline"];
    socket.emit("responsePipeline", pipeline);
  });
});
