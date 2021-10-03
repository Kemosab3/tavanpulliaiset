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

const Home = ({navigation}) => {
  const {mediaArray} = useMedia(false);
  console.log('MyFiles: mediaArray', mediaArray);

  const pickOfTheDay = Math.floor(Math.random() * mediaArray.length);
  console.log('Arvottu numero: ', pickOfTheDay);
  // console.log('MyFiles: mediaArray', mediaArray[pickOfTheDay]);
  console.log(
    'OSOITE: '
    // uploadsUrl + mediaArray[pickOfTheDay].thumbnails.w320
  );

  const icon =
    mediaArray.length > 1
      ? {uri: uploadsUrl + mediaArray[pickOfTheDay].thumbnails.w320}
      : require('../assets/splash.png');
  console.log('ICOOON: ', icon);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>DOG OF THE DAY!!!</Text>
      <Image
        style={styles.image}
        // source={require('../assets/splash.png')}
        // source={{uri: 'https://placekitten.com/400/400'}}
        // source={require('../assets/splash.png')}
        source={icon}
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

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
