function getElem(id) {
  return document.getElementById(id);
}

// html elements

const video = getElem("video");
const canvas = getElem("canvas");
const start = getElem("start");
const capture = getElem("capture");
const train = getElem("train");
const input = getElem("label");
const getResult = getElem("get-result");
const resultText = getElem("result");
const numClasses = getElem("num-classes");

start.addEventListener("click", setup);
capture.addEventListener("click", drawOnCanvas);
train.addEventListener("click", trainModel);
getResult.addEventListener("click", getPrediction);

let classifier;

function modalReady() {
  console.log("Model is ready!");
}

function videoReady() {
  console.log("Video is ready");
}

function setup() {
  const mobilenet = ml5.featureExtractor(
    "MobileNet",
    { numLabels: parseInt(numClasses.value) },
    modalReady
  );

  classifier = mobilenet.classification(video, videoReady);

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
  });
}

function drawOnCanvas() {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, 400, 300);

  addImageToModel();
}

function addImageToModel() {
  classifier.addImage(canvas, input.value);
}

function trainModel() {
  classifier.train((lossValue) => {
    console.log("Loss is", lossValue);
  });
}

function getPrediction() {
  const callback = () =>
    classifier.classify(video, (err, results) => {
      if (!results) return;

      let final = {
        label: "",
        confidence: 0,
      };

      results.forEach((result) => {
        if (result.confidence > final.confidence) {
          final = result;
        }
      });
      resultText.innerHTML = final.label + " " + final.confidence.toFixed(2);
    });

  setInterval(() => callback(), 200);
}
