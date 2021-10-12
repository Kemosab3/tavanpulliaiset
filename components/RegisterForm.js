import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {View, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {TextInput, Text} from 'react-native-paper';
import useSignUpForm from '../hooks/RegisterHooks';
import {MainContext} from '../contexts/MainContext';
import {useLogin, register} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterForm = () => {
  /*
  const doRegister = async () => {
    const serverResponse = await register(inputs);
    if (serverResponse) {
      Alert.alert(serverResponse.message);
    } else {
      Alert.alert('register failed');
    }
  };
  */
  const {setUser, user, setIsLoggedIn} = useContext(MainContext);
  const {inputs, errors, handleInputChange, handleOnEndEditing, checkUsername} =
    useSignUpForm();

  // lisäsin itse
  const {login} = useLogin();
  // const {register} = useUser();
  const doRegister = async () => {
    delete inputs.confirmPassword;
    console.log(inputs);
    const serverResponse = await register(inputs);
    if (serverResponse) {
      Alert.alert(serverResponse.message);

      // originally was: await useLogin(inputs);
      /*
      const loginServerResponse = await login(JSON.stringify(inputs));
      // const loginServerResponse = await login(inputs);

      /*
      if (loginServerResponse) {
        Alert.alert(loginServerResponse.message);
        await AsyncStorage.setItem('userToken', loginServerResponse.token);
        setUser(loginServerResponse.user);
        console.log('user is: ', user);
        setIsLoggedIn(true);
      } else {
        Alert.alert('Login failed');
      }
      */
    } else {
      Alert.alert('register failed');
    }
  };

  return (
    <View>
      <TextInput
        autoCapitalize="none"
        label="username"
        mode="outlined"
        style={styles.registerBars}
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
        onEndEditing={(event) => {
          console.log('onendediting value', event.nativeEvent.text);
          checkUsername(event.nativeEvent.text);
          handleOnEndEditing('username', event.nativeEvent.text);
        }}
        errorMessage={errors.username}
      />
      <TextInput
        autoCapitalize="none"
        label="password"
        mode="outlined"
        style={styles.registerBars}
        theme={{
          colors: {
            placeholder: '#FF6700',
            text: 'white',
            primary: '#FF6700',
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        onEndEditing={(event) => {
          handleOnEndEditing('password', event.nativeEvent.text);
        }}
        errorMessage={errors.password}
      />
      <TextInput
        autoCapitalize="none"
        label="password again"
        mode="outlined"
        style={styles.registerBars}
        theme={{
          colors: {
            placeholder: '#FF6700',
            text: 'white',
            primary: '#FF6700',
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        secureTextEntry={true}
        onEndEditing={(event) => {
          handleOnEndEditing('confirmPassword', event.nativeEvent.text);
        }}
        errorMessage={errors.confirmPassword}
      />
      <TextInput
        autoCapitalize="none"
        label="email"
        mode="outlined"
        style={styles.registerBars}
        theme={{
          colors: {
            placeholder: '#FF6700',
            text: 'white',
            primary: '#FF6700',
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={(event) => {
          handleOnEndEditing('email', event.nativeEvent.text);
        }}
        errorMessage={errors.email}
      />
      <TouchableOpacity
        style={styles.registerButton}
        onPress={doRegister}
        disabled={
          errors.username ||
          errors.password ||
          errors.confirmPassword ||
          errors.email
        }
      >
        <Text style={styles.text}>Register!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  registerBars: {
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#FF6700',
    padding: 10,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  text: {
    color: 'white',
  },
  registerButton: {
    alignItems: 'center',
    backgroundColor: '#FF6700',
    padding: 10,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
});

RegisterForm.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default RegisterForm;
