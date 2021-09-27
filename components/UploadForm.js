import React from 'react';
import PropTypes from 'prop-types';
import {Button, Input} from 'react-native-elements';

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
      <Input
        style={{backgroundColor: 'black'}}
        placeholderTextColor="green"
        autoCapitalize="none"
        placeholder="title"
        onChangeText={(txt) => handleInputChange('title', txt)}
        onEndEditing={(event) => {
          console.log('uploadForm onEndEditingValue', event.nativeEvent.text);
          handleOnEndEditing('title', event.nativeEvent.text);
        }}
        errorMessage={errors.title}
        value={inputs.title}
      />
      <Input
        style={{backgroundColor: 'black'}}
        placeholderTextColor="green"
        autoCapitalize="none"
        placeholder="description"
        multiline={true}
        onChangeText={(txt) => handleInputChange('description', txt)}
        value={inputs.description}
      />

      <Button
        raised
        title={title}
        onPress={handleSubmit}
        loading={loading}
        disabled={
          errors.title !== null ||
          image.uri === undefined ||
          image.uri === '../assets/icon3.png'
        }
      />
    </>
  );
};

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
