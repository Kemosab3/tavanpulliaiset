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

const ListItem = ({singleMedia, navigation, showButtons}) => {
  // console.log('singleMedia', singleMedia);
  const {update, setUpdate} = useContext(MainContext);
  const {checkToken} = useUser();
  const {deleteMedia} = useMedia();
  const {getFilesByTag, addTag, deleteTag} = useTag();

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

  return (
    <RNEListItem
      bottomDivider
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
      containerStyle={{backgroundColor: 'black'}}
    >
      <Avatar
        size="large"
        square
        source={{uri: uploadsUrl + singleMedia.thumbnails?.w160}}
      ></Avatar>
      <RNEListItem.Content>
        <RNEListItem.Title numberOfLines={1} h4 style={{color: 'green'}}>
          {singleMedia.title}
        </RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={1} style={{color: 'green'}}>
          {timeSince(singleMedia.time_added)}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle numberOfLines={1} style={{color: 'green'}}>
          {singleMedia.description}
        </RNEListItem.Subtitle>
        {showButtons && (
          <>
            <Button
              type="clear"
              icon
              title="Modify"
              onPress={() => {
                navigation.navigate('Modify', {singleMedia, navigation});
              }}
            ></Button>
            <Button
              title="Delete"
              type="clear"
              icon
              onPress={async () => {
                try {
                  const token = await AsyncStorage.getItem('userToken');
                  const response = await deleteMedia(
                    singleMedia.file_id,
                    token
                  );
                  console.log('Delete', response);
                  if (response.message) {
                    setUpdate(update + 1);
                  }
                } catch (e) {
                  console.log('ListItem, delete: ', e.message);
                }
              }}
            ></Button>
            <Button
              title={'Set as avatar'}
              disabled={singleMedia.media_type === 'video'}
              onPress={() => {
                // get existing avatar tag
                // and delete it
                // add avatar tag to current file

                const gettoToken = async () => {
                  const userToken = await AsyncStorage.getItem('userToken');
                  console.log('logIn asyncstorage tokeeeeen:', userToken);
                  if (userToken) {
                    try {
                      const userInfo = await checkToken(userToken);
                      if (userInfo.user_id) {
                        // Something something
                        console.log('UserInfoooo: ', userInfo);

                        const tagS = await getFilesByTag(
                          'avatar_' + userInfo.user_id
                        );
                        if (tagS.length > 0) {
                          console.log('TÄÄK: ', tagS[0].tag_id);
                          console.log('SinkkuMedia: ', singleMedia.file_id);
                          // deleteTag(tagS[0].tag_id, userToken);

                          addTag(
                            singleMedia.file_id,
                            'avatar_' + userInfo.user_id,
                            userToken
                          );
                        } else {
                          addTag(
                            singleMedia.file_id,
                            'avatar_' + userInfo.user_id,
                            userToken
                          );
                        }
                      }
                    } catch (e) {
                      console.log('getToken', e.message);
                    }
                    return userToken;
                  }
                };

                gettoToken();
              }}
            />
          </>
        )}
      </RNEListItem.Content>
      <RNEListItem.Chevron />
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

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showButtons: PropTypes.bool,
};

export default ListItem;
