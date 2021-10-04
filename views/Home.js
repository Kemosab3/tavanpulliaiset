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
import {Icon} from 'react-native-elements';

const Home = ({navigation}) => {
  const {mediaArray} = useMedia(false);
  // console.log('MyFiles: mediaArray', mediaArray);

  const pickOfTheDay = Math.floor(Math.random() * mediaArray.length);
  // console.log('Arvottu numero: ', pickOfTheDay);
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
      <View style={styles.picOfTheWeek}>
        <View style={styles.imageBox}>
          <Image
            style={styles.image}
            // source={require('../assets/splash.png')}
            // source={{uri: 'https://placekitten.com/400/400'}}
            // source={require('../assets/splash.png')}
            source={icon}
          ></Image>
        </View>
        <View style={styles.picOfTheWeekIcons}>
          <Icon name="beer" type="ionicon" color="#FF6700" />
          <Icon name="flower" type="ionicon" color="#FF6700" />
          <Icon name="heart" type="ionicon" color="#FF6700" />
        </View>
        <Text style={styles.picOfTheWeekDesc}>
          Iconin tiedot pitäisi saada yleiseen käyttöön. Tästä pitäisi myös
          tehdä komponentti. Rupikoiso! Mitäs muuta tähän kirjoittelisi...
          Tralalaa, lallallaa, placeholder text, öhhöhöö, namnamnam, sibulski.
        </Text>
      </View>

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
    color: '#FF6700',
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
    height: 270,
    marginLeft: 8,
    marginBottom: 10,
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
    justifyContent: 'space-around',
    marginTop: 8,
    marginLeft: 8,
  },
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
