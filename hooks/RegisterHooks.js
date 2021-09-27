// RegisterHooks.js:
import {useState} from 'react';
import {useUser} from './ApiHooks';
import {validator} from '../utils/validator';

const constraints = {
  username: {
    presence: true,
    length: {
      minimum: 3,
      message: 'minimum 3 chars',
    },
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
  email: {
    presence: true,
    email: true,
  },
  full_name: {
    length: {
      minimum: 3,
      message: 'minimum 3 chars',
    },
  },
};

const useSignUpForm = (callback) => {
  const {checkUsernameAvailable} = useUser();
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (name, text) => {
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const handleOnEndEditing = (name, text) => {
    // 1. validate input value
    // const error = null;
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

  const checkUsername = async (username) => {
    // TODO: add check username functionality to Api hooks and use it
    // add error to input element if username is reserved
    if (username.length < 3) {
      return;
    }
    try {
      const isAvailable = await checkUsernameAvailable(username);
      console.log('checkUsername available', isAvailable);
      if (!isAvailable) {
        setErrors((errors) => {
          return {...errors, username: 'Username already exists'};
        });
      }
    } catch (error) {
      console.log('username check failed', error);
    }
  };

  return {
    handleInputChange,
    handleOnEndEditing,
    inputs,
    errors,
    checkUsername,
  };
};

export default useSignUpForm;
