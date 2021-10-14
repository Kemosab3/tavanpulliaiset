/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import {Card, ListItem, Text} from 'react-native-elements';
import {View} from 'react-native';
import {highlightOrange, mainOrange} from '../assets/colors';
import {useMedia} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
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

  const setFormVisibility = () => {
    setRegisterFormToggle(!registerFormToggle);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {registerFormToggle ? (
        <ScrollView>
          <Card containerStyle={styles.card}>
            <Card.Title h4 style={styles.title}>
              Register
            </Card.Title>
            <RegisterForm
              navigation={navigation}
              setFormVisibility={setFormVisibility}
            />
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
                <ScrollView styde={styles.ccTextBox}>
                  <Text style={styles.modalText}>
                    The content shared through this app is licensed under
                    Creative Commons BY-SA 4.0. You are free to...
                  </Text>
                  <Text style={styles.modalText}>
                    Share — copy and redistribute the material in any medium or
                    format
                  </Text>
                  <Text style={styles.modalText}>
                    Adapt — remix, transform, and build upon the material for
                    any purpose, even commercially.
                  </Text>
                  <Text style={styles.modalText}>
                    Under the following terms:
                  </Text>
                  <Text style={styles.modalText}>
                    Attribution — You must give appropriate credit, provide a
                    link to the license, and indicate if changes were made. You
                    may do so in any reasonable manner, but not in any way that
                    suggests the licensor endorses you or your use.
                  </Text>
                  <Text style={styles.modalText}>
                    ShareAlike — If you remix, transform, or build upon the
                    material, you must distribute your contributions under the
                    same license as the original.
                  </Text>
                </ScrollView>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setRegisterFormToggle(!registerFormToggle);
                  }}
                >
                  <Text style={styles.textStyle}>ACCEPT</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Card containerStyle={styles.card}>
            <View style={styles.imageBox}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => {
                  const kukkaMaaria = [5, 5, 1, 1, 1];
                  handlePlaySound(kukkaMaaria);
                }}
              >
                <Image
                  style={styles.image}
                  source={require('../assets/diskettigray.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.titleBox}>
              <Text style={styles.titleText}>
                Click the disk if yoy dare to hear gibberish music! Login (or
                register) to enjoy more no, none, null nonsense content...
              </Text>
            </View>
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
              // console.log('Juma');
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignContent: 'center',
  },
  imageBox: {
    display: 'flex',
    alignItems: 'center',
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
  modalTextBox: {
    display: 'flex',

  },
  modalView: {
    margin: 30,
    backgroundColor: mainOrange,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: highlightOrange,
    padding: 35,
    top: '25%',
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
    backgroundColor: mainOrange,
    padding: 10,
    elevation: 2,
    marginTop: 10,
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
  titleText: {
    color: highlightOrange,
    textAlign: 'justify',
  },
  titleBox: {
    display: 'flex',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: mainOrange,
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  playButton: {
    display: 'flex',
    flexWrap: 'wrap',
    position: 'relative',
  },
  modalText: {
    borderColor: 'black',
    textAlign: 'justify',
    color: '#ffffff',
    paddingBottom: 10,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
