import {Audio} from 'expo-av';
import {audioJorma, audioKalevi, audioPentti} from './variables';

const handlePlaySound = async (note) => {
  Audio.setIsEnabledAsync(true);
  const difecta = note[1] + note[2];
  const trifecta = note[0] + note[1] + note[2];

  for (let i = 0; i < note.length; i++) {
    const soundObject = new Audio.Sound();
    if (soundObject) {
      try {
        if (i === 0) {
          if (note[0] % 2 !== 0 && difecta < 17) {
            await soundObject.loadAsync(audioPentti[difecta]);
          } else {
            await soundObject.loadAsync(audioPentti[note[i]]);
          }
        } else {
          if (note[i] % 2 === 0 && trifecta < 20) {
            await soundObject.loadAsync(audioJorma[trifecta]);
          } else {
            await soundObject.loadAsync(audioKalevi[note[i]]);
          }
        }

        console.log('SOUNDI NRO: ', note[i]);
        await soundObject
          .playAsync()
          .then(async (playbackStatus) => {
            setTimeout(() => {
              soundObject.unloadAsync();
            }, playbackStatus.playableDurationMillis);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }
};

let a = 0;
let b = 0;
let c = 0;
let d = 0;
let e = 0;

const musicArrayMaker = (dataUrl) => {
  console.log('RESULTTTTT:', dataUrl.length);
  let tapio;
  if (dataUrl.length < 10000) {
    tapio =
      dataUrl.length.toString() +
      2 * dataUrl.length.toString() +
      3 * dataUrl.length.toString() +
      4 * dataUrl.length.toString() +
      5 * dataUrl.length.toString();
  } else {
    tapio = dataUrl.length.toString();
  }

  a = parseInt(tapio[0]);
  b = parseInt(tapio[1]);
  c = parseInt(tapio[2]);
  d = parseInt(tapio[3]);
  e = parseInt(tapio[4]);

  const kukkaMaaria = [e, d, c, b, a];
  return kukkaMaaria;
};

const toDataURL = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

export {handlePlaySound, musicArrayMaker, toDataURL};
