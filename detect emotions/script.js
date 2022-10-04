const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const button = document.getElementById('button')
let cameraOperation = true;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(
button.onclick = function(){
  if (cameraOperation==true){
      stopCamera();
  }
  else {
      startCamera();
  }
  });

function startCamera(){
    cameraOperation = true;
    button.innerText = "Stop camera";
    navigator.mediaDevices.getUserMedia({ video: true,
                                          audio: false})
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        window.alert("No camera detected!");
        button.disabled = true;
      });
    }
  
  function stopCamera() {
    cameraOperation = false;
    button.innerText = "Start camera";
    var stream = video.srcObject;
    var tracks = stream.getTracks();
  
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }
    video.srcObject = null;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }


  video.onplay = function(){
  const displaySize ={width: video.videoWidth,
  height: video.videoHeight};
  faceapi.matchDimensions(canvas,displaySize);
  setInterval(async()=>{
  const detections = await faceapi.detectAllFaces(video,
  new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  faceapi.draw.drawDetections(canvas, resizedDetections);
  faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);}
