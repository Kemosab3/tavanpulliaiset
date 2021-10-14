import React, {useContext, useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {useMedia, useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import ListItem from './ListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const List = ({navigation}) => {
  const {update, setUpdate} = useContext(MainContext);
  const [isFetching, setIsFetching] = useState(false);
  const {mediaArray, deleteMedia} = useMedia();
  const [newMediaArray, setNewMediaArray] = useState([]);
  // console.log('Media', mediaArray[7]);
  // console.log('List test');
  const {getAllUsers, getUserInfo} = useUser();

  const makePrivateArray = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await getAllUsers(userToken);

      const newMedia = [];
      let control = 0;
      if (result) {
        for (let i = 0; i < mediaArray.length; i++) {
          for (let j = 0; j < result.length; j++) {
            if (mediaArray[i].user_id === result[j].user_id) {
              const loser = await getUserInfo(result[j].user_id, userToken);
              // console.log('Luuseri?', loser);
              if (loser.full_name !== 'private') {
                newMedia[control] = mediaArray[i];
                control++;
                continue;
              }
            }
          }
        }
      }

      setNewMediaArray(newMedia.reverse());
    } catch (e) {
      console.log('makePrivateArray error', e.message);
    }
  };

  const refreshList = () => {
    setIsFetching(true);
    setUpdate(update + 1);
  };
  useEffect(() => {
    makePrivateArray();
    setIsFetching(false);
  }, [mediaArray]);

  makePrivateArray();

  return (
    <FlatList
      data={newMediaArray}
      renderItem={({item}) => (
        <ListItem
          singleMedia={item}
          navigation={navigation}
          deleteMedia={deleteMedia}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      onRefresh={refreshList}
      refreshing={isFetching}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default List;
