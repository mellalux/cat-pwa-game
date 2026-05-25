// sound.js
// Lihtne helide mängija

const sounds = {
  catch_mouse: new Audio('snd/catch_mouse.mp3'),
  catch_laser: new Audio('snd/catch_laser.mp3'),
  catch_feather: new Audio('snd/catch_feather.mp3'),
  burst: new Audio('snd/burst.mp3'),
  mode: new Audio('snd/mode.mp3'),
  start: new Audio('snd/start.mp3'),
};

function playSound(name) {
  const s = sounds[name];
  if (s) {
    s.currentTime = 0;
    s.play();
  }
}
