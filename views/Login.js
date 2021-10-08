/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import {ImageBackground} from 'react-native';
import {Card, ListItem, Text} from 'react-native-elements';
import {View, StatusBar} from 'react-native';
import ListNotLoggedIn from '../components/List';

import {useMedia} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Image, Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {handlePlaySound} from '../utils/soundFunctions';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {checkToken} = useUser();
  const [registerFormToggle, setRegisterFormToggle] = useState(false);

  // console.log('Login isLoggedIn', isLoggedIn);

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('logIn asyncstorage token:', userToken);
    if (userToken) {
      try {
        const userInfo = await checkToken(userToken);
        if (userInfo.user_id) {
          setUser(userInfo);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log('getToken', e.message);
      }
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  // PICK OF THE DAY STUFF:

  const {mediaArray} = useMedia();
  // console.log('MyFiles: mediaArray', mediaArray);

  const pickOfTheDay = Math.floor(Math.random() * mediaArray.length);
  // console.log('Arvottu numero: ', pickOfTheDay);
  // console.log('MyFiles: mediaArray', mediaArray[pickOfTheDay]);
  console.log(
    'OSOITE: '
    // uploadsUrl + mediaArray[pickOfTheDay].thumbnails.w320
  );

  const picSource =
    mediaArray.length > 1
      ? {uri: uploadsUrl + mediaArray[pickOfTheDay].thumbnails.w320}
      : require('../assets/splash.png');
  console.log('ICOOON: ', picSource);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ImageBackground
        source={require('../assets/splash.png')}
        style={styles.image}
      >
        {registerFormToggle ? (
          <ScrollView>
            <Card>
              <Card.Divider />
              <Card.Title h4>Register</Card.Title>
              <RegisterForm navigation={navigation} />
            </Card>
          </ScrollView>
        ) : (
          <ScrollView>
            <Card>
              <Card.Title h4>Welcome to the GIBBERATOR</Card.Title>
              <Text style={styles.text}>
                Click on the picture to hear gibberish noise! Login (or
                register) to enjoy more no no nonsense content...
              </Text>

              <Card.Image
                source={picSource}
                onPress={() => {
                  const kukkaMaaria = [5, 1, 1, 1, 1];
                  handlePlaySound(kukkaMaaria);
                }}
              />
            </Card>
            <Card>
              <Card.Title h4>Login</Card.Title>
              <LoginForm navigation={navigation} />
            </Card>
          </ScrollView>
        )}
        {/* TODO: add link/button & event handler to change state: setRegformtoggle(!regformtoggle);  */}
        <Card>
          <ListItem
            onPress={() => {
              setRegisterFormToggle(!registerFormToggle);
            }}
          >
            <ListItem.Content>
              <Text style={styles.text}>
                {registerFormToggle
                  ? 'Already registered? Login here'
                  : 'No account? Register here.'}
              </Text>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </Card>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'orange',
    textAlign: 'center',
  },
  imageBox: {
    borderWidth: 3,
    borderColor: '#FF6700',
    shadowColor: '#FF6700',
    shadowRadius: 8,
    shadowOpacity: 0.7,
    height: 200,
  },
  container2: {
    height: 225,
  },

  picOfTheWeek: {
    height: 270,
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
    justifyContent: 'space-between',
    marginTop: 8,
    marginLeft: 8,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
