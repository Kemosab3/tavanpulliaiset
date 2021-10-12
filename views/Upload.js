/* eslint-disable no-undef */
import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import UploadForm from '../components/UploadForm';
import {Image, Card} from 'react-native-elements';
import {Button} from 'react-native-paper';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appID} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {ScrollView} from 'react-native-gesture-handler';
import {RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_VARIABLE_CONSTRAINED} from 'expo-av/build/Audio';
// import exampleImage from '../assets/icon3.png';

const Upload = ({navigation}) => {
  const [image, setImage] = useState(require('../assets/icon3.png'));
  const [filetype, setFiletype] = useState('');
  const {inputs, handleInputChange, handleReset, errors, handleOnEndEditing} =
    useUploadForm();
  const {uploadMedia, loading} = useMedia();
  const {addTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  // const exampleImageUri = Image.resolveAssetSource(exampleImage).uri;

  const doUpload = async () => {
    const filename = image.uri.split('/').pop();
    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : filetype;
    if (filetype === 'video') {
      type = match ? `video/${match[1]}` : filetype;
    }
    if (type === 'image/jpg') type = 'image/jpeg';
    console.log('TYYPPI: ', type);
    const formData = new FormData();
    formData.append('file', {uri: image.uri, name: filename, type});
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    // console.log('doUpload', formData);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // console.log('doUpload', formData);
      const result = await uploadMedia(formData, userToken);
      // console.log('doUpload', result);
      const tagResult = await addTag(result.file_id, appID, userToken);
      // console.log('doUpload addTag', tagResult);
      if (tagResult.message) {
        Alert.alert(
          'Upload',
          result.message,
          [
            {
              text: 'Ok',
              onPress: () => {
                handleReset();
                setImage(require('../assets/icon3.png'));
                // setImage(require({uri: exampleImageUri}));
                navigation.navigate('Home');
                setUpdate(update + 1); // paree olla navigaten jälkeen
              },
            },
          ],
          {cancelable: false}
        );
      }
    } catch (e) {
      console.log('doUpload error', e.message);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log('pickImage ', result);
    console.log('width', result.width);

    // console.log('DATAAAAA: ', imgData);

    if (!result.cancelled) {
      setImage({uri: result.uri});
      setFiletype(result.type);
    }
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <ScrollView style={{backgroundColor: 'black', marginTop: 10}}>
        <Card containerStyle={styles.uploadCard}>
          <View style={{backgroundColor: 'black'}}>
            <Image source={image} style={{width: '100%', height: 200}} />
            <Button
              mode="contained"
              style={styles.pickImageButton}
              onPress={pickImage}
            >
              Select image
            </Button>
            <UploadForm
              title="Upload"
              handleSubmit={doUpload}
              handleInputChange={handleInputChange}
              handleOnEndEditing={handleOnEndEditing}
              errors={errors}
              loading={loading}
              image={image}
              inputs={inputs}
            />
            {loading && <ActivityIndicator />}
            <Button
              mode="contained"
              style={styles.resetButton}
              onPress={() => {
                setImage(require('../assets/icon3.png'));
                handleReset();
              }}
            >
              Reset
            </Button>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  uploadCard: {
    backgroundColor: 'black',
    borderColor: '#FF6700',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  pickImageButton: {
    display: 'flex',
    backgroundColor: '#FF6700',
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#FF6700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  resetButton: {
    backgroundColor: '#FF6700',
    marginTop: 10,
    color: 'white',
  },
});

Upload.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Upload;
