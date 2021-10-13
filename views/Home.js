import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, StatusBar, Platform} from 'react-native';
import {Image, Text} from 'react-native-elements';
import {FlatList} from 'react-native';
import {useMedia, useUser} from '../hooks/ApiHooks';
import ListItem from '../components/ListItem';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const Home = ({navigation}) => {
  const {mediaArray} = useMedia(false);
  const [newMediaArray, setNewMediaArray] = useState([]);
  // console.log('Media', mediaArray[7]);

  const {getAllUsers, getUserInfo} = useUser();

  const makePrivateArray = async () => {
    // const newMedia = [];
    // console.log('Pituus ', newMedia.length);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // console.log('TOKEN?', userToken);
      const result = await getAllUsers(userToken);
      const filteredUsers = result.filter(
        (user) => user.full_name != 'private'
      );
      // console.log('Result?', filteredUsers);
      // const newMedia = [];
      const filteredMedia = mediaArray.filter((media) => {
        return filteredUsers.filter((user) => {
          if (media.user_id === user.user_id) {
            // newMedia.push(media);
            return media;
          }
        });
      });
      // console.log('Media', filteredMedia);
      setNewMediaArray(filteredMedia);
      /*
      let control = 0;

      if (result) {
        for (let i = 0; i < mediaArray.length; i++) {
          for (let j = 0; j < result.length; j++) {
            if (mediaArray[i].user_id === result[j].user_id) {
              const loser = await getUserInfo(result[j].user_id, userToken);
              // console.log('Luuseri?', loser);
              if (loser.full_name !== 'private') {
                newMedia[control] = mediaArray[i];
                console.log('FULLNAME: ', result[j]);
                control++;
                continue;
              }
            }
          }
        }
        //  console.log('Private dancer: ', newMedia.length);
      }
      */
      // console.log('newmedia?', newMedia);
      // console.log('newMedia', newMedia);
      // setNewMediaArray(newMedia);
    } catch (e) {
      console.log('makePrivateArray error', e.message);
    }
    // console.log('WWWWWWWW ', newMediaArray);

    // return newMedia;
  };

  // state jolle annetaan uusi arvo
  useEffect(() => {
    // makePrivateArray();
  }, []);
  // pitäisi olla useEffectin sisällä

  // let theMediaArray = newMediaArray;
  /*
  if (newMediaArray.length > 0) {
    theMediaArray = newMediaArray;
  } else {
    theMediaArray = mediaArray;
  }
  */

  // const pickOfTheDay = Math.floor(Math.random() * theMediaArray.length);

  const picSource =
    newMediaArray.length > 1
      ? {uri: uploadsUrl + newMediaArray[0].thumbnails.w320}
      : require('../assets/splash.png');
  // console.log('ICOOooooooON: ', picSource);

  console.log('Public dancer: ', newMediaArray.length);

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
          ></Image>
        </View>
        <View style={styles.picOfTheWeekIcons}>
          <Icon name="beer" type="ionicon" color="#FF6700" />
          <Text style={styles.picOfTheWeekDesc}>15k</Text>
        </View>
      </View>

      <FlatList
        data={mediaArray}
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
