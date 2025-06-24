const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusText = document.getElementById('status');

canvasElement.width = 640;
canvasElement.height = 480;

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(onResults);

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];

    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const indexTip = landmarks[8];

    const isThumbUp = thumbTip.y < thumbIP.y && thumbTip.y < indexTip.y;

    statusText.innerText = isThumbUp ? "👍 Thumbs Up Detected!" : "✋ Show a Thumbs Up!";
  } else {
    statusText.innerText = "No hand detected.";
  }

  canvasCtx.restore();
}

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480
});
camera.start();
