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
          <Card containerStyle={styles.card}>
            <Card.Title h4 style={styles.title}>
              Register
            </Card.Title>
            <RegisterForm navigation={navigation} />
          </Card>
        ) : (
          <Card containerStyle={styles.card}>
            <Card.Title h4 style={styles.title}>Login</Card.Title>
            <LoginForm navigation={navigation} />
          </Card>
        )}
        <Card containerStyle={styles.swapViewCard}>
          <ListItem
            containerStyle={styles.swapViewButton}
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
    color: 'white',
  },
  card: {
    backgroundColor: 'black',
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
    borderColor: '#FF6700',
  },
  swapViewCard: {
    backgroundColor: 'black',
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
    borderColor: '#FF6700',
  },
  swapViewButton: {
    backgroundColor: '#FF6700',
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
    borderColor: '#FF6700',
  },
  title: {
    color: '#FF6700',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
