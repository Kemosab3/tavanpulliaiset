import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {View, Alert, StyleSheet} from 'react-native';
import {TextInput, Text, HelperText, Button} from 'react-native-paper';
import useSignUpForm from '../hooks/RegisterHooks';
import {MainContext} from '../contexts/MainContext';
import {useLogin, register} from '../hooks/ApiHooks';
import {mainOrange, highlightOrange} from '../assets/colors';

const RegisterForm = ({setFormVisibility}) => {
  const {setUser, user, setIsLoggedIn} = useContext(MainContext);
  const {inputs, errors, handleInputChange, handleOnEndEditing, checkUsername} =
    useSignUpForm();

  // lisäsin itse
  const {login} = useLogin();
  const doRegister = async () => {
    delete inputs.confirmPassword;
    console.log(inputs);
    const serverResponse = await register(inputs);
    if (serverResponse) {
      Alert.alert(serverResponse.message);
      setFormVisibility();
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
            placeholder: mainOrange,
            text: 'white',
            primary: highlightOrange,
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
      />
      {errors.username && (
        <>
          <HelperText type="error" visible={errors.username}>
            {errors.username}
          </HelperText>
        </>
      )}
      <TextInput
        autoCapitalize="none"
        label="email"
        mode="outlined"
        style={styles.registerBars}
        theme={{
          colors: {
            placeholder: mainOrange,
            text: 'white',
            primary: highlightOrange,
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={(event) => {
          handleOnEndEditing('email', event.nativeEvent.text);
        }}
      />
      {errors.email && (
        <>
          <HelperText type="error" visible={errors.email}>
            {errors.email}
          </HelperText>
        </>
      )}
      <TextInput
        autoCapitalize="none"
        label="password"
        mode="outlined"
        style={styles.registerBars}
        theme={{
          colors: {
            placeholder: mainOrange,
            text: 'white',
            primary: highlightOrange,
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        onEndEditing={(event) => {
          handleOnEndEditing('password', event.nativeEvent.text);
        }}
      />
      {errors.password && (
        <>
          <HelperText type="error" visible={errors.password}>
            {errors.password}
          </HelperText>
        </>
      )}
      <TextInput
        autoCapitalize="none"
        label="password again"
        mode="outlined"
        style={styles.registerBars}
        theme={{
          colors: {
            placeholder: mainOrange,
            text: 'white',
            primary: highlightOrange,
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        secureTextEntry={true}
        onEndEditing={(event) => {
          handleOnEndEditing('confirmPassword', event.nativeEvent.text);
        }}
      />
      {errors.confirmPassword && (
        <>
          <HelperText type="error" visible={errors.confirmPassword}>
            {errors.confirmPassword}
          </HelperText>
        </>
      )}
      <Button
        mode="contained"
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
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  registerBars: {
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  text: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: mainOrange,
    marginTop: 10,
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
});

RegisterForm.propTypes = {
  navigation: PropTypes.object.isRequired,
  setFormVisibility: PropTypes.func.isRequired,
};

export default RegisterForm;
