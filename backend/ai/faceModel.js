const faceapi = require("face-api.js");
const canvas = require("canvas");

require("@tensorflow/tfjs");
require("@tensorflow/tfjs-backend-cpu");

const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({
  Canvas,
  Image,
  ImageData,
});

const loadModels = async () => {
  const MODEL_URL = __dirname + "/../models";

  await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
};

module.exports = { loadModels };