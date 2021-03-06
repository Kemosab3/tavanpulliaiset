import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import {TextInput} from 'react-native-paper';
import {MainContext} from '../contexts/MainContext';
import useUploadForm from '../hooks/UploadHooks';
import PropTypes from 'prop-types';
import ListItem from '../components/ListItem';
import {useMedia} from '../hooks/ApiHooks';
import {mainOrange, highlightOrange} from '../assets/colors';

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
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          label="Search"
          autoCapitalize="none"
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
          style={{flex: 1, marginRight: 10}}
          onChangeText={(txt) => handleInputChange('title', txt)}
          onEndEditing={(event) => {
            handleOnEndEditing('title', event.nativeEvent.text);
          }}
        ></TextInput>
        <View style={{alignSelf: 'center'}}>
          <TouchableOpacity style={styles.searchButton} onPress={doSearch}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    display: 'flex',
    height: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 8,
    marginRight: 8,
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: mainOrange,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
});

Search.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Search;
