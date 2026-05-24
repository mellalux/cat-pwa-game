// sound.js
// Lihtne helide mängija

const sounds = {
  catch_mouse: new Audio('catch_mouse.mp3'),
  catch_laser: new Audio('catch_laser.mp3'),
  catch_feather: new Audio('catch_feather.mp3'),
  burst: new Audio('burst.mp3'),
  mode: new Audio('mode.mp3'),
  start: new Audio('start.mp3'),
};

function playSound(name) {
  const s = sounds[name];
  if (s) {
    s.currentTime = 0;
    s.play();
  }
}
