import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import useLoginForm from '../hooks/LoginHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../hooks/ApiHooks';
import {mainOrange, highlightOrange} from '../assets/colors';

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
        placeholderTextColor={highlightOrange}
        style={styles.loginBars}
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
            placeholder: mainOrange,
            text: 'white',
            primary: highlightOrange,
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
      />

      <View>
        <Button style={styles.loginButton} mode="contained" onPress={doLogin}>
          Log in
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginBars: {
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  loginButton: {
    backgroundColor: mainOrange,
    padding: 10,
    marginTop: 16,
    elevation: 2,
    shadowColor: mainOrange,
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
