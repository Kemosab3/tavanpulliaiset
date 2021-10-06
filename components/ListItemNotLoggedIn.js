import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Button, ListItem as RNEListItem} from 'react-native-elements';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {formatDate, timeSince} from '../utils/dateFunctions';
import {addOrientationChangeListener} from 'expo-screen-orientation';
import {set} from 'date-fns';

const ListItemNotLoggedIn = ({singleMedia, navigation, showButtons}) => {
  // console.log('singleMedia', singleMedia);
  const {update, setUpdate} = useContext(MainContext);
  // const {checkToken} = useUser();
  // const {deleteMedia} = useMedia();
  const {getFilesByTag, addTag} = useTag();

  /*
  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // console.log('logIn asyncstorage token:', userToken);
    if (userToken) {
      try {
        const userInfo = await checkToken(userToken);
        if (userInfo.user_id) {
          // Something something
        }
      } catch (e) {
        console.log('getToken', e.message);
      }
    }
    return userToken;
  };

  useEffect(() => {
    getToken();
  }, []);

  */

  return (
    <RNEListItem
      containerStyle={{
        backgroundColor: 'black',
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: '#FF6700',
        marginBottom: 10,
        marginLeft: 8,
        marginRight: 8,
        elevation: 2,
        shadowColor: '#FF6700',
        shadowRadius: 8,
        shadowOpacity: 0.5,
      }}
    >
      <Avatar
        size="large"
        square
        source={{uri: uploadsUrl + singleMedia.thumbnails?.w160}}
      ></Avatar>
      <RNEListItem.Content>
        <RNEListItem.Title numberOfLines={1} h4 style={{color: '#FF6700'}}>
          {singleMedia.title}
        </RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={1} style={{color: '#FF6700'}}>
          {timeSince(singleMedia.time_added)}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle numberOfLines={1} style={{color: '#FF6700'}}>
          {singleMedia.description}
        </RNEListItem.Subtitle>
      </RNEListItem.Content>
      <RNEListItem.Chevron style={{color: '#FF6700'}} />
    </RNEListItem>
  );
};

// not in use
const styles = StyleSheet.create({
  textbox: {
    flex: 2,
    backgroundColor: 'black',
    color: 'green',
  },
  image: {
    flex: 1,
    borderRadius: 3,
    width: 100,
    height: 100,
  },
});

ListItemNotLoggedIn.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showButtons: PropTypes.bool,
};

export default ListItemNotLoggedIn;
