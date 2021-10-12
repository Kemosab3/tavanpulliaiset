import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Alert} from 'react-native';
import {Button, Input} from 'react-native-elements';
import useUploadForm from '../hooks/EditProfileHooks';
import {useUser} from '../hooks/ApiHooks';
import useUserInfo from '../hooks/ProfileHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

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
    <View>
      <Input
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        value={inputs.email}
        onEndEditing={(event) => {
          handleOnEndEditing('email', event.nativeEvent.text);
        }}
        errorMessage={errors.email}
      />

      <Input
        autoCapitalize="none"
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(txt) => handleInputChange('password', txt)}
        onEndEditing={(event) => {
          handleOnEndEditing('password', event.nativeEvent.text);
        }}
        errorMessage={errors.password}
      />
      <Input
        autoCapitalize="none"
        placeholder="password again"
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        secureTextEntry={true}
        onEndEditing={(event) => {
          handleOnEndEditing('confirmPassword', event.nativeEvent.text);
        }}
        errorMessage={errors.confirmPassword}
      />
      <Button
        raised
        title={'Upload changes'}
        onPress={() => {
          doEditProfile();

          setUserInfo((user) => ({
            ...user,
            email: inputs.email,
          }));
        }}
        disabled={errors.password || errors.confirmPassword || errors.email}
      />
    </View>
  );
};

EditProfile.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default EditProfile;
