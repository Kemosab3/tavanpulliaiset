import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, StatusBar, Platform} from 'react-native';
import {Image, Text} from 'react-native-elements';
import List from '../components/List';
import {useMedia, useUser} from '../hooks/ApiHooks';
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

const Home = ({navigation}) => {
  // const picSource = require('../assets/splash.png');
  const {mediaArray} = useMedia();
  const {getUserInfo} = useUser();
  const [picOfSomething, setPicOfSomething] = useState([]);

  const makeHomePic = async () => {
    // const newMedia = [];
    // console.log('Pituus ', newMedia.length);
    try {
      for (let i = 0; i < mediaArray.length; i++) {
        const userToken = await AsyncStorage.getItem('userToken');
        const checker = await getUserInfo(mediaArray[i].user_id, userToken);
        console.log('CHECKER: ', checker);
        if (checker.full_name !== 'private') {
          setPicOfSomething(mediaArray[i]);

          break;
        }
      }
    } catch (e) {
      console.log('makeHomePic error', e.message);
    }
  };
  console.log('SOME PIC: ', picOfSomething);

  useEffect(() => {
    makeHomePic();
  }, []);

  const picSource =
    picOfSomething !== null || picOfSomething !== undefined
      ? {uri: uploadsUrl + picOfSomething.thumbnails.w320}
      : require('../assets/bjorn.jpg');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>DOG OF THE DAY!!!</Text>
      <View style={styles.picOfTheWeek}>
        <View style={styles.imageBox}>
          <Image
            style={styles.image}
            // source={require('../assets/splash.png')}
            // source={{uri: 'https://placekitten.com/400/400'}}
            source={picSource}
          ></Image>
          <Image
            style={styles.imagePlay}
            // source={require('../assets/splash.png')}
            // source={{uri: 'https://placekitten.com/400/400'}}
            // source={require('../assets/splash.png')}
            // source={picSource}
            source={require('../assets/playbutton.png')}
            onPress={() => {
              const kukkaMaaria = [5, 11, 13, 15, 12];
              handlePlaySound(kukkaMaaria);
            }}
          ></Image>
        </View>
        <View style={styles.picOfTheWeekIcons}>
          <Icon name="beer" type="ionicon" color="#FF6700" />
          <Text style={styles.picOfTheWeekDesc}>15k</Text>
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
    color: 'orange',
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
  },
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
