const baseUrl = 'https://media.mw.metropolia.fi/wbma/';

const uploadsUrl = baseUrl + 'uploads/';

const appID = 'joninAppi';

const one = require('../assets/huokaus.mp3');
const two = require('../assets/jippii.mp3');
const three = require('../assets/Launcher_Explosion.wav');
const four = require('../assets/Shotgun_Shot.wav');
const five = require('../assets/Turret_Alert.mp3');

const audioJorma = [one, two, three, four, five, one, two, three, four, five];

export {baseUrl, uploadsUrl, appID, audioJorma};
