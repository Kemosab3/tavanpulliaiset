import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Alert} from 'react-native';
import {Button, Input} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
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
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      });
    })();
  }, []);

  const doEditProfile = async () => {
    try {
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
    <View>
      <Input
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={(event) => {
          console.log('editProfile onEndEditingValue', event.nativeEvent.text);
          handleOnEndEditing('username', event.nativeEvent.text);
        }}
        errorMessage={errors.username}
        value={inputs.username}
      />
      <Input
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        value={inputs.email}
      />
      <Input
        autoCapitalize="none"
        placeholder="full_name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
        value={inputs.full_name}
      />
      <Input
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
      />
      <Button
        raised
        title={'Upload changes'}
        onPress={() => {
          doEditProfile();

          setUserInfo((user) => ({
            ...user,
            username: inputs.username,
            email: inputs.email,
          }));
        }}
      />
    </View>
  );
};

EditProfile.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default EditProfile;
