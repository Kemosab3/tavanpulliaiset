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
  console.log('WHO the fuck', userInfo);

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
    // paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  image: {
    justifyContent: 'center',
    height: 150,
    // height: undefined,
    // aspectRatio: 3,
    borderRadius: 25,
  },
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
