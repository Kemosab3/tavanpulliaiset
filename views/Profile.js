import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, ActivityIndicator} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, ListItem} from 'react-native-elements';
import {useTag, useUser} from '../hooks/ApiHooks';
import useUserInfo from '../hooks/ProfileHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import {ScrollView} from 'react-native-gesture-handler';

const Profile = ({route, navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  let [avatar, setAvatar] = useState('https://placekitten.com/400/400');
  let {userInfo} = useUserInfo(user);
  const [ownerInfo, setOwnerInfo] = useState({username: ''});

  const {getUserInfo} = useUser();

  const {params} = route;
  console.log('PARAMEDICS: ', params);

  const {getFilesByTag} = useTag();

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

  useEffect(() => {
    getOwnerInfo();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <ScrollView style={{backgroundColor: 'black'}}>
      <Card containerStyle={{backgroundColor: 'black'}}>
        <Card.Title>
          <Text style={{color: 'green', fontSize: 39}} h3>
            {userInfo.username}
          </Text>
        </Card.Title>
        <Card.Image
          source={{uri: avatar}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
        />
        <ListItem containerStyle={{backgroundColor: 'black'}}>
          <Avatar icon={{name: 'email', color: 'green'}} />
          <Text style={{color: 'green', fontSize: 17}}>{userInfo.email}</Text>
        </ListItem>
        <ListItem containerStyle={{backgroundColor: 'black'}}>
          <Avatar icon={{name: 'user', type: 'font-awesome', color: 'green'}} />
          <Text style={{color: 'green', fontSize: 17}}>
            {userInfo.full_name}
          </Text>
        </ListItem>
        <ListItem
          bottomDivider
          containerStyle={{backgroundColor: 'black'}}
          onPress={() => {
            navigation.navigate('My Files');
          }}
        >
          <Avatar icon={{name: 'logout', color: 'green'}} />
          <ListItem.Content>
            <ListItem.Title style={{color: 'green', fontSize: 17}}>
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
          <Avatar icon={{name: 'logout', color: 'green'}} />
          <ListItem.Content>
            <ListItem.Title style={{color: 'green', fontSize: 17}}>
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
          <Avatar icon={{name: 'logout', color: 'green'}} />
          <ListItem.Content>
            <ListItem.Title style={{color: 'green', fontSize: 17}}>
              Logout
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {width: '100%', height: undefined, borderRadius: 250, aspectRatio: 1},
});

Profile.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default Profile;
