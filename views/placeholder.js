// HOME!!!!!

import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';

import useUserInfo from '../hooks/ProfileHooks';
import {MainContext} from '../contexts/MainContext';
import {Image, Text} from 'react-native-elements';
import {useMedia} from '../hooks/ApiHooks';

const Home = ({navigation}) => {
  const {user} = useContext(MainContext);
  // const [avatar, setAvatar] = useState('https://placekitten.com/400/400');
  const {userInfo} = useUserInfo(user);
  // const {mediaArray} = useMedia(true);
  console.log('UUSER', user);
  // console.log('MEDIAÖRREI', mediaArray[0].file_id);

  // const pictureUser = getUserInfo(params.user_id, token);
  // const {userInfo} = useUser(mediaArray.user_id);
  // console.log('MyFiles: mediaArray', mediaArray[1].thumbnails.w320);
  console.log('WHO', userInfo);

  const {mediaArray} = useMedia(true);
  // console.log('MEDIAÖRREI', mediaArray);
  // console.log('MEDIAÖRREI', mediaArray[0].file_id);

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>DOG OF THE DAY!!!</Text>
        <Image
          style={styles.image}
          source={{uri: 'https://placekitten.com/400/400'}}
        ></Image>
        <List navigation={navigation}></List>
        <View style={styles.container2}></View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    color: 'green',
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
    borderRadius: 25,
  },
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;


// HOME MODIFIED (A LITTLE)

import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';

import useUserInfo from '../hooks/ProfileHooks';
import {MainContext} from '../contexts/MainContext';
import {Image, Text} from 'react-native-elements';
import {useMedia} from '../hooks/ApiHooks';
import {baseUrl} from '../utils/variables';
import {uploadsUrl} from '../utils/variables';

const Home = ({navigation}) => {
  const {user} = useContext(MainContext);
  // const [avatar, setAvatar] = useState('https://placekitten.com/400/400');
  const {userInfo} = useUserInfo(user);
  // const {mediaArray} = useMedia(true);
  console.log('UUSER', user);
  // console.log('MEDIAÖRREI', mediaArray[0].file_id);

  // const pictureUser = getUserInfo(params.user_id, token);
  // const {userInfo} = useUser(mediaArray.user_id);
  // console.log('MyFiles: mediaArray', mediaArray[1].thumbnails.w320);
  console.log('WHO', userInfo);

  const {mediaArray} = useMedia(true);

  console.log('MEDIAÖRREI', mediaArray[0].thumbnails.w160);
  console.log('MEDIAÖRREI', mediaArray[0].file_id);

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>DOG OF THE DAY!!!</Text>
        <Image
          style={styles.image}
          // source={{uri: 'https://placekitten.com/400/400'}}
          // source={{uri: uploadsUrl + mediaArray[1].thumbnails.w160}}
          source={require('../assets/splash.png')}
        ></Image>
        <List navigation={navigation}></List>
        <View style={styles.container2}></View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    color: 'green',
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
    borderRadius: 25,
  },
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;



// HOME FROM MYFILES:

import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {Image, Text} from 'react-native-elements';
import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from '../components/ListItem';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const MyFiles = ({navigation}) => {
  const {mediaArray} = useMedia(false);
  // console.log('MyFiles: mediaArray', mediaArray);

  const dickOfTheDay = Math.floor(Math.random() * mediaArray.length);
  console.log('Arvottu numero: ', dickOfTheDay);
  // console.log('MyFiles: mediaArray', mediaArray[dickOfTheDay]);
  console.log(
    'OSOITE: ',
    uploadsUrl + mediaArray[dickOfTheDay].thumbnails.w320
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>DOG OF THE DAY!!!</Text>
      <Image
        style={styles.image}
        // source={require('../assets/splash.png')}
        // source={{uri: 'https://placekitten.com/400/400'}}
        source={require('../assets/splash.png')}
      ></Image>

      <FlatList
        data={mediaArray.reverse()}
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
    color: 'green',
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
    borderRadius: 25,
  },
});

MyFiles.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default MyFiles;

