import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Button} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import List from '../components/List';
import useUploadForm from '../hooks/UploadHooks';
import PropTypes from 'prop-types';
import {useMedia} from '../hooks/ApiHooks';

const Search = ({navigation}) => {
  const {handleInputChange, handleOnEndEditing, errors, inputs} =
    useUploadForm();
  const {searchMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const doSearch = async () => {
    console.log('Search dosearch clicked');
    console.log(inputs);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await searchMedia(inputs, userToken);
      if (result.message) {
        Alert.alert(
          'Search',
          result.message,
          [
            {
              text: 'Ok',
              onPress: () => {
                setUpdate(update + 1);
              },
            },
          ],
          {cancelable: false}
        );
      }
    } catch (e) {
      console.log('doSearch error', e.message);
    }
  };
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <View>
          <Input
            autoCapitalize="none"
            placeholder="Search"
            onChangeText={(txt) => handleInputChange('title', txt)}
            onEndEditing={(event) => {
              console.log(
                'searchFrom onEndEditingValue',
                event.nativeEvent.text
              );
              handleOnEndEditing('title', event.nativeEvent.text);
            }}
            errorMessage={errors.title}
          ></Input>
          <Button raised title={'Search'} onPress={doSearch} />
        </View>
        <List navigation={navigation}></List>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    color: 'green',
  },
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});

Search.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Search;
