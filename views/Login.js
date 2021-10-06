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
            <View style={styles.container}>
              <ListNotLoggedIn navigation={navigation}></ListNotLoggedIn>
              <StatusBar style="auto" />
            </View>
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
    color: 'black',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
