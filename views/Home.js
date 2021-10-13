import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {Image, Text} from 'react-native-elements';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Icon} from 'react-native-elements';

const Home = ({navigation}) => {
  const picSource = require('../assets/splash.png');

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
        </View>
        <View style={styles.picOfTheWeekIcons}>
          <Icon name="beer" type="ionicon" color="#FF6700" />
          <Text style={styles.picOfTheWeekDesc}>15k</Text>
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
