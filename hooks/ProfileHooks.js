import {useState} from 'react';

const useUserInfo = (user) => {
  const [userInfo, setUserInfo] = useState({
    username: user.username,
    email: user.email,
    full_name: user.full_name,
  });

  return {userInfo, setUserInfo};
};

export default useUserInfo;
