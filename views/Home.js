import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  SliderComponent,
  TouchableOpacity,
} from 'react-native';
import {Image, Text} from 'react-native-elements';
import {FlatList} from 'react-native';
import {useFavourites, useMedia, useUser} from '../hooks/ApiHooks';
import ListItem from '../components/ListItem';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {mainOrange, highlightOrange} from '../assets/colors';
import {handlePlaySound, musicArrayMaker} from '../utils/soundFunctions';

const Home = ({navigation}) => {
  const {mediaArray} = useMedia(false);
  const [newMediaArray, setNewMediaArray] = useState([]);

  const {getAllUsers, getUserInfo} = useUser();

  const {getFavouritesByFileID} = useFavourites();

  const [likes, setLikes] = useState([]);

  const makePrivateArray = async () => {
    const newMedia = [];
    // console.log('Pituus ', newMedia.length);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // console.log('TOKEN?', userToken);
      const result = await getAllUsers(userToken);
      // console.log('Result?', result);
      let control = 0;
      if (result !== undefined && result !== null) {
        for (let i = 0; i < mediaArray.length; i++) {
          for (let j = 0; j < result.length; j++) {
            if (mediaArray[i].user_id === result[j].user_id) {
              const loser = await getUserInfo(result[j].user_id, userToken);
              if (loser.full_name !== 'private') {
                newMedia[control] = mediaArray[i];
                // console.log('FULLNAME: ', result[j]);
                control++;
              }
            }
          }
        }
        //  console.log('Private dancer: ', newMedia.length);
      }
      setNewMediaArray(newMedia);
    } catch (e) {
      console.log('makePrivateArray error', e.message);
    }
    // console.log('WWWWWWWW ', newMediaArray);

    // return newMedia;
  };

  // state jolle annetaan uusi arvo

  makePrivateArray();

  let theMediaArray = newMediaArray;

  /*
  if (newMediaArray.length > 0) {
    theMediaArray = newMediaArray;
  } else {
    theMediaArray = mediaArray;
  }
  */

  // const pickOfTheDay = Math.floor(Math.random() * theMediaArray.length);

  const picSource =
    theMediaArray.length > 1
      ? {uri: uploadsUrl + theMediaArray[0].thumbnails.w320}
      : require('../assets/splash.png');
  // console.log('ICOOooooooON: ', picSource);

  // console.log('Public dancer: ', newMediaArray.length);

  const getLikes = async () => {
    const liking2 = await getFavouritesByFileID(theMediaArray[0].file_id);
    setLikes(liking2.length);
  };

  useEffect(() => {
    getLikes();
  }, []);

  getLikes();

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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>DOG OF THE DAY!!!</Text>
      <View style={styles.picOfTheWeek}>
        <View style={styles.imageBox}>
          <Image
            style={styles.image}
            // source={require('../assets/splash.png')}
            // source={{uri: 'https://placekitten.com/400/400'}}
            // source={require('../assets/splash.png')}
            source={picSource}
            // source={require('../assets/playbutton.png')}
          ></Image>
          <Image
            style={styles.imagePlay}
            // source={require('../assets/splash.png')}
            // source={{uri: 'https://placekitten.com/400/400'}}
            // source={require('../assets/splash.png')}
            // source={picSource}
            source={require('../assets/playbutton.png')}
            onPress={() => {
              toDataURL(uploadsUrl + theMediaArray[0].filename).then(
                (dataUrl) => {
                  const kukkaMaaria = musicArrayMaker(dataUrl);
                  handlePlaySound(kukkaMaaria);
                }
              );
            }}
          ></Image>
        </View>
        <View style={styles.picOfTheWeekIcons}>
          <Icon name="beer" type="ionicon" color="#FF6700" />
          <Text style={styles.picOfTheWeekDesc}>{likes}</Text>
        </View>
      </View>

      <FlatList
        data={theMediaArray.reverse()}
        renderItem={({item}) => (
          <ListItem
            singleMedia={item}
            navigation={navigation}
            // showButtons={true}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.container2}></View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    color: mainOrange,
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
  imagePlay: {
    justifyContent: 'center',
    height: 100,
  },
  imageBox: {
    borderWidth: 3,
    borderColor: mainOrange,
    shadowColor: mainOrange,
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
    color: mainOrange,
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

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
