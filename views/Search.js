import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Button} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import useUploadForm from '../hooks/UploadHooks';
import PropTypes from 'prop-types';
import ListItem from '../components/ListItem';
import {useMedia} from '../hooks/ApiHooks';

const Search = ({navigation}) => {
  const {handleInputChange, handleOnEndEditing, errors, inputs} =
    useUploadForm();
  const {searchMedia, searchMediaArray} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const [isFetching, setIsFetching] = useState(false);

  const refreshList = () => {
    setIsFetching(true);
    setUpdate(update + 1);
  };
  useEffect(() => {
    setIsFetching(false);
  }, [searchMediaArray]);

  const doSearch = async () => {
    console.log('Search dosearch clicked');
    console.log(inputs);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await searchMedia(inputs, userToken);
      refreshList();
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
              /*
              console.log(
                'searchFrom onEndEditingValue',
                event.nativeEvent.text
              );
              */
              handleOnEndEditing('title', event.nativeEvent.text);
            }}
            errorMessage={errors.title}
          ></Input>
          <Button raised title={'Search'} onPress={doSearch} />
        </View>
        <FlatList
          data={searchMediaArray}
          renderItem={({item}) => (
            <ListItem singleMedia={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={refreshList}
          refreshing={isFetching}
        />
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
