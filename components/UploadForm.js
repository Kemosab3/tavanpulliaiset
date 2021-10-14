import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {TextInput, Button, HelperText} from 'react-native-paper';
import {mainOrange, highlightOrange} from '../assets/colors';

const UploadForm = ({
  title,
  inputs,
  handleSubmit,
  handleInputChange,
  loading,
  errors,
  handleOnEndEditing,
  image,
}) => {
  return (
    <>
      <TextInput
        autoCapitalize="none"
        label="title"
        mode="outlined"
        style={styles.uploadFormInput}
        theme={{
          colors: {
            placeholder: mainOrange,
            text: 'white',
            primary: highlightOrange,
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
        onChangeText={(txt) => handleInputChange('title', txt)}
        onEndEditing={(event) => {
          console.log('uploadForm onEndEditingValue', event.nativeEvent.text);
          handleOnEndEditing('title', event.nativeEvent.text);
        }}
        errorMessage={errors.title}
        value={inputs.title}
      />
      {errors.title && (
        <>
          <HelperText type="error" visible={errors.title}>
            {errors.title}
          </HelperText>
        </>
      )}
      <TextInput
        autoCapitalize="none"
        label="description"
        mode="outlined"
        style={styles.uploadFormInput}
        theme={{
          colors: {
            placeholder: mainOrange,
            text: 'white',
            primary: highlightOrange,
            underlineColor: 'transparent',
            background: 'black',
          },
        }}
        onChangeText={(txt) => handleInputChange('description', txt)}
        value={inputs.description}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={styles.uploadButton}
        disabled={
          errors.title !== null ||
          image.uri === undefined ||
          image.uri === '../assets/icon3.png'
        }
      >
        Upload
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  uploadFormInput: {
    marginTop: 5,
  },
  uploadButton: {
    backgroundColor: mainOrange,
    marginTop: 10,
  },
});

UploadForm.propTypes = {
  title: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleOnEndEditing: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
  inputs: PropTypes.object,
};

export default UploadForm;
