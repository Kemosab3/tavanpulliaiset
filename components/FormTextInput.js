import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Input} from 'react-native-elements';

const FormTextInput = ({style, ...otherProps}) => {
  return <Input TextInput style={[style]} {...otherProps} />;
};

FormTextInput.propTypes = {
  style: PropTypes.object,
};

export default FormTextInput;
