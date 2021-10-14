import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Text} from 'react-native-elements';
import List from '../components/List';
import {useMedia, useUser, useFavourites} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  handlePlaySound,
  musicArrayMaker,
  toDataURL,
} from '../utils/soundFunctions';
import {mainOrange} from '../assets/colors';

const Home = ({navigation}) => {
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
      }
    }

    if (checker > 0) {
      setIAmLikingIt(false);
    } else {
      setIAmLikingIt(true);
    }

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
      <Text style={styles.text}>STAFF FAVOURITE:</Text>
      <View style={styles.picOfTheWeek}>
        <View style={styles.imageBox}>
          <Image style={styles.image} source={picSource}></Image>
        </View>
        <View style={styles.picOfTheWeekIcons}>
          {iAmLikingIt ? (
            <TouchableOpacity
              onPress={async () => {
                const token = await AsyncStorage.getItem('userToken');

                const response = await addFavourite(
                  picOfSomething.file_id,
                  token
                );
                setIAmLikingIt(false);
              }}
            >
              <Image source={require('../assets/pintempty.png')} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              title="Unlike"
              onPress={async () => {
                const token = await AsyncStorage.getItem('userToken');
                const response = await deleteFavourite(
                  picOfSomething.file_id,
                  token
                );
                setIAmLikingIt(true);
              }}
            >
              <Image source={require('../assets/pintfull.png')} />
            </TouchableOpacity>
          )}
          <Text style={styles.likeText}>Likes: {likes}</Text>
          <TouchableOpacity
            style={styles.playButton}
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
            <Image
              style={styles.playButtonImage}
              source={require('../assets/playbutton.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <List navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    color: '#FF6700',
    paddingBottom: 140,
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
    alignContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'black',
    marginLeft: 15,
  },
  playButtonImage: {
    height: 25,
    aspectRatio: 3,
    position: 'relative',
  },
  likeText: {
    color: mainOrange,
    fontSize: 17,
    marginLeft: 15,
  },
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
