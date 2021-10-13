/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Modal,
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
import {mainOrange, highlightOrange} from '../assets/colors';
import {useMedia} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Image, Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {handlePlaySound} from '../utils/soundFunctions';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {checkToken} = useUser();
  const [registerFormToggle, setRegisterFormToggle] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

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
        source={require('../assets/diskettibackground.png')}
        style={styles.image}
      >
        {registerFormToggle ? (
          <ScrollView>
            <Card containerStyle={styles.card}>
              <Card.Title h4 style={styles.title}>
                Register
              </Card.Title>
              <RegisterForm navigation={navigation} />
            </Card>
          </ScrollView>
        ) : (
          <ScrollView>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>ACCEPT THE TERMS!</Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setRegisterFormToggle(!registerFormToggle);
                    }}
                  >
                    <Text style={styles.textStyle}>Hide Modal</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Card containerStyle={styles.card}>
              <Text
                style={styles.text}
                onPress={() => {
                  const kukkaMaaria = [5, 1, 1, 1, 1];
                  handlePlaySound(kukkaMaaria);
                }}
              >
                Click on this text to hear gibberish noise! Login (or register)
                to enjoy more no no nonsense content...
              </Text>
              <Card.Title h4 style={styles.title}>
                Login
              </Card.Title>

              <LoginForm navigation={navigation} />
            </Card>
          </ScrollView>
        )}
        <Card containerStyle={styles.swapViewCard}>
          <ListItem
            containerStyle={styles.swapViewButton}
            onPress={() => {
              if (!registerFormToggle) {
                console.log('Juma');
                setModalVisible(true);
              } else {
                setRegisterFormToggle(!registerFormToggle);
              }
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
    color: 'white',
  },
  card: {
    backgroundColor: 'black',
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
    borderColor: mainOrange,
  },
  swapViewCard: {
    backgroundColor: 'black',
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
    borderColor: mainOrange,
    marginBottom: 20,
  },
  swapViewButton: {
    backgroundColor: mainOrange,
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
    borderColor: mainOrange,
  },
  title: {
    color: mainOrange,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
