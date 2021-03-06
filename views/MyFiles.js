import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from '../components/ListItem';
import PropTypes from 'prop-types';

const MyFiles = ({navigation}) => {
  const {mediaArray, deleteMedia} = useMedia(true);
  // console.log('MyFiles: mediaArray', mediaArray);
  return (
    <View style={styles.container}>
      <FlatList
        data={mediaArray.reverse()}
        renderItem={({item}) => (
          <ListItem
            singleMedia={item}
            navigation={navigation}
            showButtons={true}
            deleteMedia={deleteMedia}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    paddingTop: 10,
    height: '100%',
  },
});

MyFiles.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default MyFiles;
