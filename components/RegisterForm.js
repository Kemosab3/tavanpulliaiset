import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {View, Alert} from 'react-native';
import {Button, Text} from 'react-native-elements';
import FormTextInput from './FormTextInput';
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

      const loginServerResponse = await login(JSON.stringify(inputs));
      // const loginServerResponse = await login(inputs);

      if (loginServerResponse) {
        Alert.alert(loginServerResponse.message);
        await AsyncStorage.setItem('userToken', loginServerResponse.token);
        setUser(loginServerResponse.user);
        console.log('user is: ', user);
        setIsLoggedIn(true);
      } else {
        Alert.alert('Login failed');
      }
    } else {
      Alert.alert('register failed');
    }
  };

  return (
    <View>
      <Text h4>Register:</Text>
      <Text h4></Text>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={(event) => {
          console.log('onendediting value', event.nativeEvent.text);
          checkUsername(event.nativeEvent.text);
          handleOnEndEditing('username', event.nativeEvent.text);
        }}
        errorMessage={errors.username}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        onEndEditing={(event) => {
          handleOnEndEditing('password', event.nativeEvent.text);
        }}
        errorMessage={errors.password}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password again"
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        secureTextEntry={true}
        onEndEditing={(event) => {
          handleOnEndEditing('confirmPassword', event.nativeEvent.text);
        }}
        errorMessage={errors.confirmPassword}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={(event) => {
          handleOnEndEditing('email', event.nativeEvent.text);
        }}
        errorMessage={errors.email}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
        onEndEditing={(event) => {
          handleOnEndEditing('full_name', event.nativeEvent.text);
        }}
        errorMessage={errors.full_name}
      />
      <Button
        title="Register!"
        onPress={doRegister}
        raised
        disabled={
          errors.username ||
          errors.password ||
          errors.confirmPassword ||
          errors.email
        }
      />
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default RegisterForm;
