import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Alert, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import useUploadForm from '../hooks/EditProfileHooks';
import {useUser} from '../hooks/ApiHooks';
import useUserInfo from '../hooks/ProfileHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {mainOrange, highlightOrange} from '../assets/colors';

const EditProfile = ({route, navigation}) => {
  // const navigation = route.params.navigation;
  // const [image, setImage] = useState(require('../assets/icon3.png'));
  const {inputs, handleInputChange, errors, handleOnEndEditing, setInputs} =
    useUploadForm();
  const {modifyUserInfo} = useUser();

  // const {update, setUpdate, user} = useContext(MainContext);
  let {user} = useContext(MainContext);
  const {setUserInfo} = useUserInfo(user);

  const {params} = route;
  if (params !== undefined) {
    user = params;
  }

  useEffect(() => {
    (() => {
      setInputs({
        email: user.email,
      });
    })();
  }, []);

  const doEditProfile = async () => {
    try {
      delete inputs.confirmPassword;
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await modifyUserInfo(inputs, userToken);
      if (result.message) {
        Alert.alert(
          'Edit Profile',
          result.message,
          [
            {
              text: 'Ok',
              onPress: () => {
                navigation.navigate('Profile', inputs);
                console.log('INPUTTI ', inputs);
              },
            },
          ],
          {cancelable: false}
        );
      }
    } catch (e) {
      console.log('doEditProfile error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputStyle}>
        <TextInput
          mode="outlined"
          autoCapitalize="none"
          label="email"
          theme={{
            colors: {
              placeholder: mainOrange,
              text: 'white',
              primary: mainOrange,
              underlineColor: 'transparent',
              background: 'black',
            },
          }}
          onChangeText={(txt) => handleInputChange('email', txt)}
          value={inputs.email}
          onEndEditing={(event) => {
            handleOnEndEditing('email', event.nativeEvent.text);
          }}
          errorMessage={errors.email}
        />
      </View>
      <View style={styles.inputStyle}>
        <TextInput
          mode="outlined"
          autoCapitalize="none"
          label="password"
          theme={{
            colors: {
              placeholder: mainOrange,
              text: 'white',
              primary: mainOrange,
              underlineColor: 'transparent',
              background: 'black',
            },
          }}
          secureTextEntry={true}
          onChangeText={(txt) => handleInputChange('password', txt)}
          onEndEditing={(event) => {
            handleOnEndEditing('password', event.nativeEvent.text);
          }}
          errorMessage={errors.password}
        />
      </View>
      <View style={styles.inputStyle}>
        <TextInput
          mode="outlined"
          autoCapitalize="none"
          label="password again"
          theme={{
            colors: {
              placeholder: mainOrange,
              text: 'white',
              primary: mainOrange,
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
      </View>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => {
          doEditProfile();

          setUserInfo((user) => ({
            ...user,
            email: inputs.email,
          }));
        }}
        disabled={errors.password || errors.confirmPassword || errors.email}
      >
        Upload changes
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    display: 'flex',
    height: '100%',
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  inputStyle: {
    elevation: 2,
    shadowColor: highlightOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
    marginBottom: 10,
  },
  button: {
    marginTop: 5,
    backgroundColor: mainOrange,
    color: mainOrange,
  },
});

EditProfile.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default EditProfile;
