import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Card,
  ListItem,
  Text,
  Button,
  Icon,
  Avatar,
} from 'react-native-elements';
import {Audio, Video} from 'expo-av';
import {useFavourites, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatDate} from '../utils/dateFunctions';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';
// import PixelColor from 'react-native-pixel-color';
// import {Canvas} from 'react-native-canvas';
import {MainContext} from '../contexts/MainContext';
import {handlePlaySound, musicArrayMaker} from '../utils/soundFunctions';
// import WebView from 'react-native-webview';

// import * as React from 'react';

const Single = ({route}) => {
  const {params} = route;

  console.log('PARAAAAA ', params);

  const {getUserInfo} = useUser();
  const [ownerInfo, setOwnerInfo] = useState({username: ''});
  const [likes, setLikes] = useState([]);
  const [iAmLikingIt, setIAmLikingIt] = useState();
  // const [likes, setLikes] = useState([]);

  const [videoRef, setVideoRef] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const {setIsLoggedIn, user} = useContext(MainContext);
  const {
    addFavourite,
    deleteFavourite,
    getMyFavourites,
    getFavouritesByFileID,
  } = useFavourites();

  useEffect(() => {
    (async () => {
      const file = await getFilesByTag('avatar_' + params.user_id);
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
    const token = await AsyncStorage.getItem('userToken');
    const liking = await getMyFavourites(token);
    const liking2 = await getFavouritesByFileID(params.file_id);
    let checker = 0;

    for (let i = 0; i < liking.length; i++) {
      if (liking[i].file_id === params.file_id) {
        checker += 1;
        console.log('liking.file_id: ', liking[i].file_id);
      }
    }
    console.log('CHECKER: ', checker);

    if (checker > 0) {
      setIAmLikingIt(false);
    } else {
      setIAmLikingIt(true);
    }
    console.log('MY LIKING: ', liking);
    console.log('Picture LIKING: ', liking2);
    setLikes(liking2.length);
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

  // What? ends

  // What? part 2
  const handleCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 100, 100);
  };

  // What? part 2 ends

  return (
    <ScrollView style={{backgroundColor: 'black'}}>
      <Card containerStyle={styles.card}>
        <ListItem containerStyle={{backgroundColor: 'black'}}>
          <View style={styles.avatarContainer}>
            <Avatar
              rounded
              size="small"
              source={{uri: avatar}}
              style={styles.avatar}
            />
          </View>
          {console.log('Avatar on foorumissa: ', avatar)}
          <Text style={styles.text}>{ownerInfo.username}</Text>
        </ListItem>
        {params.media_type === 'image' && (
          <Card.Image
            source={{uri: uploadsUrl + params.filename}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        )}

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
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            toDataURL(uploadsUrl + params.filename).then((dataUrl) => {
              const kukkaMaaria = musicArrayMaker(dataUrl);
              handlePlaySound(kukkaMaaria);
            });
          }}
        >
          <Image
            style={styles.playButtonImage}
            source={require('../assets/playbutton.png')}
          />
        </TouchableOpacity>
        <ListItem containerStyle={{backgroundColor: 'black'}}>
          {iAmLikingIt ? (
            <TouchableOpacity
              onPress={async () => {
                // use api hooks to Post a favourite
                console.log('I AM LIKE: ', iAmLikingIt);

                console.log('FILETSU ID: ', params.file_id);
                const token = await AsyncStorage.getItem('userToken');
                console.log('Token? : ', token);
                const response = await addFavourite(params.file_id, token);
                console.log('Likeeeeee ', response);
                setIAmLikingIt(false);
                getLikes();
              }}
            >
              <Icon name="beer" type="ionicon" color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              title="Unlike"
              onPress={async () => {
                // use api hooks to DELETE a favourite
                console.log('I AM LIKE: ', iAmLikingIt);
                const token = await AsyncStorage.getItem('userToken');
                const response = await deleteFavourite(params.file_id, token);
                setIAmLikingIt(true);
                getLikes();
                console.log('Likeeeeee ', response);
              }}
            >
              <Icon name="beer" type="ionicon" color="#FF6700" />
            </TouchableOpacity>
          )}
          <Text style={styles.text}>Likes: {likes}</Text>
        </ListItem>
        <ListItem containerStyle={{backgroundColor: 'black'}}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#FF6700'}}>
              {params.title}
            </ListItem.Title>
            <ListItem.Subtitle style={{color: '#FF6700'}}>
              {formatDate(new Date(params.time_added), 'd. MMMM y')}
            </ListItem.Subtitle>
            <ListItem.Subtitle style={{color: '#FF6700'}}>
              klo {formatDate(new Date(params.time_added), 'HH.mm')}
            </ListItem.Subtitle>
            <Text style={styles.description}>{params.description}</Text>
          </ListItem.Content>
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
    borderColor: '#FF6700',
    borderWidth: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },

  description: {
    marginBottom: 10,
    color: '#FF6700',
  },
  card: {
    borderColor: '#FF6700',
    backgroundColor: 'black',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  avatarContainer: {
    display: 'flex',
    borderColor: '#FF6700',
    borderWidth: 2,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  avatar: {
    position: 'relative',
    height: 50,
    width: 50,
    borderWidth: 2,
    borderRadius: 25,
  },
  text: {
    color: '#FF6700',
    fontSize: 17,
  },
  playButton: {
    position: 'absolute',
    height: 50,
    display: 'flex',
    top: 390,
    left: 8,
    backgroundColor: 'black',
  },
  playButtonImage: {
    height: '100%',
    position: 'relative',
  },
});

Single.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Single;
