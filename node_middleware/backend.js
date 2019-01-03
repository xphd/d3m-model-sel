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
const path = "./responses/getSearchSolutionsResultsResponses/";
const solutions = []; // each element is solution_id
fs.readdirSync(path).forEach(filename => {
  const solution = {
    id: filename,
    score: 0
  };
  solutions.push(solution); // filename is nothing but solution_id
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

    // get scores
    const path_scoreSolution = "./responses/scoreSolutionResponses/";
    const path_getScoreSolution =
      "./responses/getScoreSolutionResultsResponses/";
    solutions.forEach(solution => {
      let id = solution.id;
      let tempObj = fs.readFileSync(path_scoreSolution + id, "utf-8");

      let tempObj2 = fs.readFileSync(
        path_getScoreSolution + JSON.parse(tempObj).request_id + ".json",
        "utf-8"
      );
      let score = JSON.parse(tempObj2).scores[0].value.raw.double;
      solution.score = score;
    });

    // get pipelineSize
    const path_describeSolution = "./responses/describeSolutionResponses/";
    solutions.forEach(solution => {
      let id = solution.id;
      let tempObj = fs.readFileSync(path_describeSolution + id, "utf-8");
      let size = JSON.parse(tempObj).pipeline.steps.length;
      solution.pipelineSize = size;
    });
    console.log(solutions[0]);
    socket.emit("responseSolutions", solutions);
  });

  socket.on("requestPipeline", pipeline => {
    console.log("Server: requestPipeline received");
    console.log(pipeline);
    // console.log(typeof pipeline);
    const pipelinePath = "./responses/describeSolutionResponses/";
    const pipelineStr = fs.readFileSync(pipelinePath + pipeline, "utf8");
    const pipelineStrJSON = JSON.parse(pipelineStr);
    const pipelineObj = pipelineStrJSON["pipeline"];
    // console.log(pipelineObj);
    console.log(pipelineObj.steps.length);
    socket.emit("responsePipeline", pipelineObj);
  });
});
