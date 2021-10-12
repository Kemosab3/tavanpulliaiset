import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 6 characters',
    },
  },
  confirmPassword: {
    equality: 'password',
  },
};

const useUploadForm = (callback) => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleReset = () => {
    setInputs((inputs) => {
      return {
        ...inputs,
        email: '',
        password: '',
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
    let error;

    if (name === 'confirmPassword') {
      error = validator(
        name,
        {password: inputs.password, confirmPassword: text},
        constraints
      );
    } else {
      error = validator(name, text, constraints);
    }

    // 2. update error state
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
