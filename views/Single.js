import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {audioJorma, uploadsUrl} from '../utils/variables';
import {
  Card,
  ListItem,
  Text,
  Button,
  Icon,
  Avatar,
} from 'react-native-elements';
import {Audio, Video} from 'expo-av';
import {useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatDate} from '../utils/dateFunctions';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';
import PixelColor from 'react-native-pixel-color';
import {MainContext} from '../contexts/MainContext';

// import * as React from 'react';

const Single = ({route}) => {
  const {params} = route;
  const {getUserInfo} = useUser();
  const [ownerInfo, setOwnerInfo] = useState({username: ''});
  const [likes, setLikes] = useState([]);
  const [iAmLikingIt, setIAmLikingIt] = useState(true);
  // const [likes, setLikes] = useState([]);

  const [videoRef, setVideoRef] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const {setIsLoggedIn, user} = useContext(MainContext);

  useEffect(() => {
    (async () => {
      const file = await getFilesByTag('avatar_' + user.user_id);
      console.log('file', file);
      setAvatar(uploadsUrl + file.pop().filename);
    })();
  }, [user]);

  // screen orientation, show video in fullscreen when landscape
  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const showVideoInFullscreen = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.error('fullscreen', error.message);
    }
  };

  useEffect(() => {
    unlock();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen();
      }
    });
    // when leaving the component lock screen to portrait
    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  // end screen orientation

  const getOwnerInfo = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setOwnerInfo(await getUserInfo(params.user_id, token));
  };

  const getLikes = async () => {
    // TODO: use api hooks to get favourites
    // setLikes()
    // set the value of iAmLikingIt
  };
  const getAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + params.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getOwnerInfo();
    getAvatar;
    getLikes();
  }, []);

  // What?

  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  let e = 0;

  /*
  const one = require('../assets/huokaus.mp3');
  const two = require('../assets/jippii.mp3');
  const three = require('../assets/Launcher_Explosion.wav');
  const four = require('../assets/Shotgun_Shot.wav');
  const five = require('../assets/Turret_Alert.mp3');

  const audioJorma = [one, two, three, four, five, one, two, three, four, five];


  const audioKalevi = [
    audioJorma[a],
    audioJorma[b],
    audioJorma[c],
    audioJorma[d],
    audioJorma[e],
  ];
*/

  // console.log(audioKalevi.length);

  // let audioArray2 = [two, one, one, three, three, two, two];
  // let soundObject = new Audio.Sound();

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

  const mostCommonCharActer = (str) => {
    let charMap = {};
    let max = 0;
    let maxChar = '';
    for (let char of str) {
      charMap[char] = charMap[char] + 1 || 1;
    }
    for (let char in charMap) {
      // look at each char in charMap
      if (charMap[char] > max) {
        // if the value is greater than max
        max = charMap[char]; // update new max value
        maxChar = char; // set the max character
      }
    }
    return maxChar;
  };

  // What? ends

  // What? part 2

  // What? part 2 ends

  return (
    <ScrollView style={{backgroundColor: 'black'}}>
      <Card containerStyle={{backgroundColor: 'black'}}>
        <ListItem containerStyle={{backgroundColor: 'black'}}>
          {params.media_type === 'image' && (
            <Icon
              name="image"
              type="ionicon"
              style={{backgroundColor: 'white'}}
            />
          )}
          {params.media_type === 'video' && (
            <Icon
              name="videocam"
              type="ionicon"
              style={{backgroundColor: 'white'}}
            />
          )}
          <ListItem.Content>
            <ListItem.Title style={{color: 'green'}}>
              {params.title}
            </ListItem.Title>
            <ListItem.Subtitle style={{color: 'green'}}>
              {formatDate(new Date(params.time_added), 'eeee d. MMMM y')}
            </ListItem.Subtitle>
            <ListItem.Subtitle style={{color: 'green'}}>
              klo {formatDate(new Date(params.time_added), 'HH.mm')}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <Card.Divider />
        {params.media_type === 'image' && (
          <Card.Image
            source={{uri: uploadsUrl + params.filename}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        )}
        {console.log('Mitä helvettiä: ', params.filename.length)}
        {params.media_type === 'video' && (
          <TouchableOpacity // usePoster hides video so use this to start it
            disabled={disabled}
            onPress={() => {
              videoRef.playAsync();
              setDisabled(true); // disable touchableOpacity when video is started
            }}
          >
            <Video
              ref={handleVideoRef}
              style={styles.image}
              source={{uri: uploadsUrl + params.filename}}
              useNativeControls
              resizeMode="contain"
              usePoster
              posterSource={{uri: uploadsUrl + params.screenshot}}
            />
          </TouchableOpacity>
        )}
        {params.media_type === 'audio' && (
          <>
            <Text>Audio not supported YET.</Text>
            <Audio></Audio>
          </>
        )}
        <Card.Divider />
        <Text style={styles.description}>{params.description}</Text>
        <ListItem containerStyle={{backgroundColor: 'black'}}>
          <Avatar source={{uri: avatar}} />
          {console.log('Avatar on foorumissa: ', avatar)}
          <Text style={{color: 'green'}}>{ownerInfo.username}</Text>
        </ListItem>
        <ListItem containerStyle={{backgroundColor: 'black'}}>
          <Button
            title="Play sound"
            onPress={() => {
              // audioPointer = 0;

              toDataURL(uploadsUrl + params.filename).then((dataUrl) => {
                console.log('RESULTTTTT:', dataUrl);
                const tapio = dataUrl.length.toString();
                const ville = dataUrl.slice([1], [100]);
                a = parseInt(tapio[0]);
                b = parseInt(tapio[1]);
                c = parseInt(tapio[2]);
                d = parseInt(tapio[3]);
                e = parseInt(tapio[4]);
                console.log('RESULTTTTT1:', params.media_type);
                console.log('RESULTTTTT2:', ville.replace(/\//g, '8'));
                console.log('RESULTTTTT3:', dataUrl.length);
                console.log('RESULTTTTT4:', dataUrl.match(/A/g).length);
                console.log('RESULTTTTT5:', dataUrl.match(/a/g).length);
                console.log('TAPIOOOOO:', tapio);
                console.log('TAPIOOOOOH:', e, d, c, b, a);
                const kukkaMaaria = [e, d, c, b, a];
                handlePlaySound(kukkaMaaria);
              });
            }}
          />

          {iAmLikingIt ? (
            <Button
              title="Like"
              onPress={() => {
                // use api hooks to DELETE a favourite
              }}
            />
          ) : (
            <Button
              title="Unlike"
              onPress={() => {
                // use api hooks to DELETE a favourite
              }}
            />
          )}

          <Text style={{color: 'green'}}>Total likes: {likes.length}</Text>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
    padding: 20,
  },

  listdescription: {
    fontWeight: 'normal',
    fontSize: 17,
    paddingBottom: 15,
    color: 'green',
  },
  black: {
    backgroundColor: '#000',
    color: 'green',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 250,
  },

  description: {
    marginBottom: 10,
    color: 'green',
  },
});

Single.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Single;
