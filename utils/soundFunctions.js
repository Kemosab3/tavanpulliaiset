import {Audio} from 'expo-av';
import {audioJorma} from './variables';

const handlePlaySound = async (note) => {
  Audio.setIsEnabledAsync(true);

  for (let i = 0; i < note.length; i++) {
    const soundObject = new Audio.Sound();
    if (soundObject) {
      // console.log('Ääntä? ', audioJorma[note]);
      // soundObject.pauseAsync();
      // soundObject = new Audio.Sound();
      try {
        // const source = audioArray[note];
        // await soundObject.loadAsync(source);

        await soundObject.loadAsync(audioJorma[note[i]]);

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
  console.log('RESULTTTTT:', dataUrl);
  const tapio = dataUrl.length.toString();
  const ville = dataUrl.slice([1], [100]);
  a = parseInt(tapio[0]);
  b = parseInt(tapio[1]);
  c = parseInt(tapio[2]);
  d = parseInt(tapio[3]);
  e = parseInt(tapio[4]);
  /*
  console.log('RESULTTTTT1:', paramsMediaType);
  console.log('RESULTTTTT2:', ville.replace(/\//g, '8'));
  console.log('RESULTTTTT3:', dataUrl.length);
  console.log('RESULTTTTT4:', dataUrl.match(/A/g).length);
  console.log('RESULTTTTT5:', dataUrl.match(/a/g).length);
  console.log('TAPIOOOOO:', tapio);
  console.log('TAPIOOOOOH:', e, d, c, b, a);
  */
  const kukkaMaaria = [e, d, c, b, a];
  return kukkaMaaria;
};

export {handlePlaySound, musicArrayMaker};
