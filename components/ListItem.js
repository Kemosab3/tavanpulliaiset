import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {Button} from 'react-native-paper';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {timeSince} from '../utils/dateFunctions';
import {addOrientationChangeListener} from 'expo-screen-orientation';
import {set} from 'date-fns';
import {mainOrange, highlightOrange} from '../assets/colors';

const ListItem = ({singleMedia, navigation, showButtons, deleteMedia}) => {
  // console.log('singleMedia', singleMedia);
  const {update, setUpdate} = useContext(MainContext);
  const {checkToken} = useUser();
  const {getFilesByTag, addTag} = useTag();

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
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
      containerStyle={{
        backgroundColor: 'black',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: mainOrange,
        marginBottom: 10,
        marginLeft: 8,
        marginRight: 8,
        elevation: 2,
        shadowColor: mainOrange,
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
        <RNEListItem.Title numberOfLines={1} h4 style={{color: mainOrange}}>
          {singleMedia.title}
        </RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={1} style={{color: mainOrange}}>
          {timeSince(singleMedia.time_added)}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle numberOfLines={1} style={{color: mainOrange}}>
          {singleMedia.description}
        </RNEListItem.Subtitle>
        {showButtons && (
          <>
            <View style={styles.buttonBox}>
              <Button
                style={styles.button}
                mode="contained"
                icon
                onPress={() => {
                  navigation.navigate('Modify', {singleMedia, navigation});
                }}
              >
                Modify
              </Button>
              <Button
                style={styles.button}
                mode="contained"
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
              >
                Delete
              </Button>
            </View>
            <Button
              mode="contained"
              style={styles.button}
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
                        navigation.navigate('Profile', singleMedia.filename);
                      }
                    } catch (e) {
                      console.log('getToken', e.message);
                    }
                    // navigation.navigate('Profile');
                    return userToken;
                  }
                };
                gettoToken();
              }}
            >
              Set as avatar
            </Button>
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
  buttonBox: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  button: {
    display: 'flex',
    backgroundColor: mainOrange,
    marginTop: 10,
    marginRight: 10,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showButtons: PropTypes.bool,
};

export default ListItem;
