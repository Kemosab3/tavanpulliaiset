import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Card, Text} from 'react-native-elements';
import List from '../components/List';
import {useMedia, useUser, useFavourites, useTag} from '../hooks/ApiHooks';
import ListItem from '../components/ListItem';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {
  handlePlaySound,
  musicArrayMaker,
  toDataURL,
} from '../utils/soundFunctions';
import {mainOrange} from '../assets/colors';

const Home = ({navigation}) => {
  // const picSource = require('../assets/splash.png');
  const {mediaArray} = useMedia();
  const {getUserInfo} = useUser();
  const [picOfSomething, setPicOfSomething] = useState([]);

  const [iAmLikingIt, setIAmLikingIt] = useState();
  const [likes, setLikes] = useState([]);

  const {
    addFavourite,
    deleteFavourite,
    getMyFavourites,
    getFavouritesByFileID,
  } = useFavourites();

  const makeHomePic = async () => {
    // const newMedia = [];
    // console.log('Pituus ', newMedia.length);
    try {
      for (let i = 0; i < mediaArray.length; i++) {
        const userToken = await AsyncStorage.getItem('userToken');
        const checker = await getUserInfo(mediaArray[i].user_id, userToken);
        // console.log('CHECKER: ', checker);
        if (checker.full_name !== 'private') {
          setPicOfSomething(mediaArray[i]);

          break;
        }
      }
    } catch (e) {
      console.log('makeHomePic error', e.message);
    }
  };
  // console.log('SOME PIC: ', picOfSomething);

  const getLikes = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const liking = await getMyFavourites(token);
    const liking2 = await getFavouritesByFileID(picOfSomething.file_id);
    let checker = 0;

    for (let i = 0; i < liking.length; i++) {
      if (liking[i].file_id === picOfSomething.file_id) {
        checker += 1;
        // console.log('liking.file_id: ', liking[i].file_id);
      }
    }
    // console.log('CHECKER: ', checker);

    if (checker > 0) {
      setIAmLikingIt(false);
    } else {
      setIAmLikingIt(true);
    }
    // console.log('MY LIKING: ', liking);
    // console.log('Picture LIKING: ', liking2);
    setLikes(liking2.length);
  };

  useEffect(() => {
    makeHomePic();
    getLikes();
  }, []);

  makeHomePic();
  getLikes();

  const picSource =
    picOfSomething !== null || picOfSomething !== undefined
      ? {uri: uploadsUrl + picOfSomething.thumbnails?.w320}
      : require('../assets/bjorn.jpg');

  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
        onPress={() => {
          if (picSource === require('../assets/bjorn.jpg')) {
            const kukkaMaaria = [5, 11, 13, 15, 12];
            handlePlaySound(kukkaMaaria);
          } else {
            toDataURL(uploadsUrl + picSource).then((dataUrl) => {
              const kukkaMaaria = musicArrayMaker(dataUrl);
              handlePlaySound(kukkaMaaria);
            });
          }
        }}
      >
        STAFF FAVOURITE:
      </Text>
      <View style={styles.picOfTheWeek}>
        <View style={styles.imageBox}>
          <Image
            style={styles.image}
            // source={require('../assets/splash.png')}
            // source={{uri: 'https://placekitten.com/400/400'}}
            source={picSource}
          ></Image>
        </View>
        <View>
          {iAmLikingIt ? (
            <TouchableOpacity
              onPress={async () => {
                // use api hooks to Post a favourite
                // console.log('I AM LIKE: ', iAmLikingIt);

                // console.log('FILETSU ID: ', picOfSomething.file_id);
                const token = await AsyncStorage.getItem('userToken');
                // console.log('Token? : ', token);
                const response = await addFavourite(
                  picOfSomething.file_id,
                  token
                );
                // console.log('Likeeeeee ', response);
                setIAmLikingIt(false);
                // getLikes();
              }}
            >
              <Image source={require('../assets/pintempty.png')} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              title="Unlike"
              onPress={async () => {
                // use api hooks to DELETE a favourite
                // console.log('I AM LIKE: ', iAmLikingIt);
                const token = await AsyncStorage.getItem('userToken');
                const response = await deleteFavourite(
                  picOfSomething.file_id,
                  token
                );
                setIAmLikingIt(true);
                // getLikes();
                // console.log('Likeeeeee ', response);
              }}
            >
              <Image source={require('../assets/pintfull.png')} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <List navigation={navigation} />
      <View style={styles.container2}></View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    color: '#FF6700',
    marginBottom: 30,
  },
  container2: {
    height: 225,
  },
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  text: {
    height: 70,
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 30,
    color: mainOrange,
  },
  image: {
    justifyContent: 'center',
    height: 150,
  },
  playButtonImage: {
    width: 250,

    position: 'relative',
  },
  imagePlay: {
    justifyContent: 'center',
    height: 100,
  },
  imageBox: {
    borderWidth: 3,
    borderColor: '#FF6700',
    shadowColor: '#FF6700',
    shadowRadius: 8,
    shadowOpacity: 0.7,
  },
  picOfTheWeek: {
    marginLeft: 8,
    marginBottom: 15,
    marginRight: 8,
    elevation: 1,
  },
  picOfTheWeekDesc: {
    color: '#FF6700',
    padding: 8,
    textAlign: 'justify',
  },
  picOfTheWeekIcons: {
    display: 'flex',
    textAlign: 'left',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginLeft: 8,
  },
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
