import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  title: {
    presence: true,
    length: {
      minimum: 3,
      message: 'must be at least 3 chars',
    },
  },
};

const useUploadForm = (callback) => {
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleReset = () => {
    setInputs((inputs) => {
      return {
        ...inputs,
        title: '',
        description: '',
      };
    });
  };

  const handleInputChange = (name, text) => {
    // console.log(name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const handleOnEndEditing = (name, text) => {
    const error = validator(name, text, constraints);
    setErrors((errors) => {
      return {
        ...errors,
        [name]: error,
      };
    });
  };

  return {
    handleInputChange,
    handleReset,
    inputs,
    setInputs,
    handleOnEndEditing,
    errors,
  };
};

export default useUploadForm;
