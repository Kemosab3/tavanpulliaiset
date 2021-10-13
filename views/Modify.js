import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {View, ActivityIndicator, Alert, StyleSheet} from 'react-native';
import {Button, TextInput, HelperText} from 'react-native-paper';
import useUploadForm from '../hooks/UploadHooks';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {mainOrange, highlightOrange} from '../assets/colors';

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
                navigation.navigate('My Files');
                setUpdate(update + 1);
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
    <View style={styles.container}>
      <View style={styles.inputStyle}>
        <TextInput
          autoCapitalize="none"
          label="title"
          mode="outlined"
          theme={{
            colors: {
              placeholder: mainOrange,
              text: 'white',
              primary: highlightOrange,
              underlineColor: 'transparent',
              background: 'black',
            },
          }}
          onChangeText={(txt) => handleInputChange('title', txt)}
          onEndEditing={(event) => {
            console.log('uploadForm onEndEditingValue', event.nativeEvent.text);
            handleOnEndEditing('title', event.nativeEvent.text);
          }}
          errorMessage={errors.title}
          value={inputs.title}
        />
      </View>
      <HelperText type="error" visible={errors.title}>
        {errors.title}
      </HelperText>
      <View style={styles.inputStyle}>
        <TextInput
          label="description"
          mode="outlined"
          autoCapitalize="none"
          theme={{
            colors: {
              placeholder: mainOrange,
              text: 'white',
              primary: highlightOrange,
              underlineColor: 'transparent',
              background: 'black',
            },
          }}
          onChangeText={(txt) => handleInputChange('description', txt)}
          value={() => {
            if (inputs.description === undefined) {
              ('description');
            } else {
              inputs.description;
            }
          }}
        />
      </View>
      <HelperText type="error" visible={false}>
        Success asshole!
      </HelperText>
      <Button
        mode="contained"
        onPress={doModify}
        loading={loading}
        style={styles.button}
        disabled={errors.title !== null}
      >
        Upload changes
      </Button>
      {loading && <ActivityIndicator />}
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

Modify.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Modify;
