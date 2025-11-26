//controller_index.js
const images = [
  "assets/slider1.jpg",
  "assets/slider2.jpg",
  "assets/slider3.jpg",
  "assets/slider4.jpg"
];

let current = 0;

function nextSlide(){
  current = (current + 1) % images.length;
  document.getElementById("slideImage").src = images[current];
}

setInterval(nextSlide, 5000);
