import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  Platform,
  Alert,
  View,
  Image,
} from 'react-native';
import {Switch} from 'react-native-paper';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, ListItem} from 'react-native-elements';
import {useTag, useUser} from '../hooks/ApiHooks';
import useUserInfo from '../hooks/ProfileHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import {ScrollView} from 'react-native-gesture-handler';
import {mainOrange, highlightOrange} from '../assets/colors';

const Profile = ({route, navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  let [avatar, setAvatar] = useState('https://placekitten.com/400/400');
  let {userInfo} = useUserInfo(user);
  const [ownerInfo, setOwnerInfo] = useState({username: ''});

  const {getUserInfo} = useUser();
  const {modifyUserInfo} = useUser();

  const {params} = route;
  // console.log('PARAMEDICS: ', params);

  const {getFilesByTag} = useTag();

  const [isEnabled, setIsEnabled] = useState();

  if (params !== undefined && typeof params === 'object') {
    userInfo = params;
  }

  // console.log('Profile ', user);
  // console.log('userInfo: ', userInfo);

  if (params !== undefined && typeof params === 'string') {
    avatar = uploadsUrl + params;
  }

  useEffect(() => {
    (async () => {
      const file = await getFilesByTag('avatar_' + user.user_id);
      // console.log('file', file);
      setAvatar(uploadsUrl + file.pop().filename);
      console.log('Avataari effecti: ', avatar);
    })();
  }, [user]);

  const getOwnerInfo = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setOwnerInfo(await getUserInfo(user.user_id, token));
  };

  const getPrivacy = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const privateDancer = await getUserInfo(user.user_id, token);
    if (privateDancer.full_name === 'private') {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  };

  useEffect(() => {
    getOwnerInfo();
    getPrivacy();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
  };

  /*
  if (userInfo.full_name === 'private') {
    setIsEnabled(true);
  } else {
    setIsEnabled(false);
  }
  */

  // Original:
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    doEditPrivacy();
  };

  let inputsPrivate;

  if (isEnabled) {
    inputsPrivate = {
      full_name: 'public',
    };
  } else {
    inputsPrivate = {
      full_name: 'private',
    };
  }

  const inputs = inputsPrivate;

  const doEditPrivacy = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await modifyUserInfo(inputs, userToken);
      if (result.message) {
        Alert.alert(
          'Edit Privacy',
          result.message,
          [
            {
              text: 'Ok',
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
    <SafeAreaView style={styles.droidSafeArea}>
      <ScrollView style={{backgroundColor: 'black'}}>
        <Card containerStyle={styles.card}>
          <View style={styles.imageBox}>
            <Image
              source={{uri: avatar}}
              style={styles.image}
              PlaceholderContent={<ActivityIndicator />}
            />
          </View>
          <Card.Title>
            <Text style={styles.title} h3>
              {userInfo.username}
            </Text>
          </Card.Title>
          <Card.Title>
            <Text style={styles.text}>"Mottoni on mottojen motto!"</Text>
          </Card.Title>
          <ListItem containerStyle={{backgroundColor: 'black'}}>
            <Avatar icon={{name: 'email', color: highlightOrange}} />
            <Text style={styles.buttonText}>{userInfo.email}</Text>
          </ListItem>
          <ListItem containerStyle={{backgroundColor: 'black'}}>
            <Avatar
              icon={{
                name: 'warning',
                color: '#ffb800',
              }}
            />
            <View style={styles.privacyContainer}>
              <Text style={styles.privacyText}>Hide my files</Text>
              <Switch
                trackColor={{false: '#767577', true: highlightOrange}}
                thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </ListItem>
          <ListItem
            bottomDivider
            containerStyle={{backgroundColor: 'black'}}
            onPress={() => {
              navigation.navigate('My Files');
            }}
          >
            <Avatar icon={{name: 'folder', color: highlightOrange}} />
            <ListItem.Content>
              <ListItem.Title style={styles.buttonText}>
                My Files
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <ListItem
            bottomDivider
            containerStyle={{backgroundColor: 'black'}}
            onPress={() => {
              navigation.navigate('Edit Profile', userInfo);
            }}
          >
            <Avatar icon={{name: 'edit', color: highlightOrange}} />
            <ListItem.Content>
              <ListItem.Title style={styles.buttonText}>
                Edit Profile
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <ListItem
            bottomDivider
            onPress={logout}
            containerStyle={{backgroundColor: 'black'}}
          >
            <Avatar icon={{name: 'logout', color: highlightOrange}} />
            <ListItem.Content>
              <ListItem.Title style={styles.buttonText}>Logout</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
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
  imageBox: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  image: {
    width: '50%',
    height: undefined,
    borderRadius: 250,
    borderWidth: 2,
    borderColor: mainOrange,
    aspectRatio: 1,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    color: mainOrange,
    fontSize: 35,
    marginTop: 10,
  },
  text: {
    color: mainOrange,
    fontStyle: 'italic',
    fontSize: 17,
  },
  buttonText: {
    color: mainOrange,
    fontSize: 17,
  },
  privacyContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  privacyText: {
    color: mainOrange,
    marginRight: 25,
    fontSize: 17,
  },
  card: {
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    borderColor: mainOrange,
    elevation: 2,
    shadowColor: mainOrange,
    shadowRadius: 10,
    shadowOpacity: 0.8,
    borderWidth: 2,
    marginTop: 25,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default Profile;
