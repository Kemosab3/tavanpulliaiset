import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {TextInput} from 'react-native-paper';
import useLoginForm from '../hooks/LoginHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../hooks/ApiHooks';

const LoginForm = ({navigation}) => {
  const {inputs, handleInputChange} = useLoginForm();
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {login} = useLogin();

  const doLogin = async () => {
    try {
      const loginInfo = await login(inputs);
      console.log('doLogin response', loginInfo);
      await AsyncStorage.setItem('userToken', loginInfo.token);
      // TODO: Save user info (loginInfo.user) to MainContext
      setUser(loginInfo.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.log('doLogin error', error);
    }
    // navigation.navigate('Home');
  };

  return (
    <View>
      <TextInput
        autoCapitalize="none"
        label="username"
        mode="outlined"
        style={styles.loginBars}
        theme={{
          colors: {
            placeholder: '#FF6700',
            text: 'white',
            primary: '#FF6700',
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
        onChangeText={(txt) => handleInputChange('username', txt)}
      />
      <TextInput
        autoCapitalize="none"
        label="password"
        mode="outlined"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        style={styles.loginBars}
        theme={{
          colors: {
            placeholder: '#FF6700',
            text: 'white',
            primary: '#FF6700',
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
      />

      <View>
        <TouchableOpacity style={styles.loginButton} onPress={doLogin}>
          <Text style={styles.text}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginBars: {
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#FF6700',
    padding: 10,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  text: {
    color: 'white',
  },
});

LoginForm.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LoginForm;
