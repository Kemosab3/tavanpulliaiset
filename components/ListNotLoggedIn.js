import React, {useContext, useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import ListItem from './ListItem';

const ListNotLoggedIn = ({navigation}) => {
  const {update, setUpdate} = useContext(MainContext);
  const [isFetching, setIsFetching] = useState(false);
  const {mediaArray} = useMedia();
  const refreshList = () => {
    setIsFetching(true);
    setUpdate(update + 1);
  };
  useEffect(() => {
    setIsFetching(false);
  }, [mediaArray]);

  return (
    <FlatList
      data={mediaArray}
      renderItem={({item}) => (
        <ListItem singleMedia={item} navigation={navigation} />
      )}
      keyExtractor={(item, index) => index.toString()}
      onRefresh={refreshList}
      refreshing={isFetching}
    />
  );
};

ListNotLoggedIn.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ListNotLoggedIn;
