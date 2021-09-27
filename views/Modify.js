import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {View, ActivityIndicator, Alert} from 'react-native';
import UploadForm from '../components/UploadForm';
import {Button, Input} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const Modify = ({route}) => {
  const navigation = route.params.navigation;
  // const [image, setImage] = useState(require('../assets/icon3.png'));
  const {inputs, handleInputChange, errors, handleOnEndEditing, setInputs} =
    useUploadForm();
  const {modifyMedia, loading} = useMedia();

  const {update, setUpdate} = useContext(MainContext);

  useEffect(() => {
    (() => {
      setInputs({
        title: route.params.singleMedia.title,
        description: route.params.singleMedia.description,
      });
    })();
  }, []);

  const doModify = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await modifyMedia(
        inputs,
        userToken,
        route.params.singleMedia.file_id
      );
      if (result.message) {
        Alert.alert(
          'Modify',
          result.message,
          [
            {
              text: 'Ok',
              onPress: () => {
                setUpdate(update + 1);
                navigation.navigate('My Files');
              },
            },
          ],
          {cancelable: false}
        );
      }
    } catch (e) {
      console.log('doModify error', e.message);
    }
  };

  return (
    <View>
      <Input
        autoCapitalize="none"
        placeholder="title"
        onChangeText={(txt) => handleInputChange('title', txt)}
        onEndEditing={(event) => {
          console.log('uploadForm onEndEditingValue', event.nativeEvent.text);
          handleOnEndEditing('title', event.nativeEvent.text);
        }}
        errorMessage={errors.title}
        value={inputs.title}
      />
      <Input
        autoCapitalize="none"
        placeholder="description"
        onChangeText={(txt) => handleInputChange('description', txt)}
        value={() => {
          if (inputs.description === undefined) {
            ('description');
          } else {
            inputs.description;
          }
        }}
      />
      <Button
        raised
        title={'Modify'}
        onPress={doModify}
        loading={loading}
        disabled={errors.title !== null}
      />
      {loading && <ActivityIndicator />}
    </View>
  );
};

Modify.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Modify;
