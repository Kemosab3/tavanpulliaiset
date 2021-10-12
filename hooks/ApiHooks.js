import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {doFetch} from '../utils/http';
import {appID, baseUrl} from '../utils/variables';

const useMedia = (ownFiles = false) => {
  const [mediaArray, setMediaArray] = useState([]);
  const [searchMediaArray, setSearchMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const {update, user} = useContext(MainContext);

  useEffect(() => {
    // https://scriptverse.academy/tutorials/js-self-invoking-functions.html
    (async () => {
      try {
        const allMedia = await loadMedia();
        // allMedia.reverse();
        setMediaArray(allMedia);
      } catch (e) {
        console.log('useMedia useEffect error', e.message);
      }
    })();
  }, [update]);

  const loadMedia = async () => {
    try {
      let mediaIlmanThumbnailia = await useTag().getFilesByTag(appID);
      if (ownFiles) {
        mediaIlmanThumbnailia = mediaIlmanThumbnailia.filter((item) => {
          if (item.user_id === user.user_id) {
            return item;
          }
        });
      }

      const kaikkiTiedot = mediaIlmanThumbnailia.map(async (media) => {
        return await loadSingleMedia(media.file_id);
      });
      return Promise.all(kaikkiTiedot);
    } catch (e) {
      console.log('loadMedia', e.message);
    }
  };

  const searchMedia = async (inputs, token) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      };
      const compare = await useTag().getFilesByTag(appID);
      let result = await doFetch(baseUrl + 'media/search', options);
      // console.log('ApiHooks searchMedia', result);
      result = result.filter((item) => {
        for (let i = 0; i < compare.length; i++) {
          if (item.file_id === compare[i].file_id) {
            return item;
          }
        }
      });
      setSearchMediaArray(result);
      return result;
    } catch (e) {
      console.log('loadSingleMedia', e.message);
      return {};
    }
  };

  const loadSingleMedia = async (id) => {
    try {
      const tiedosto = await doFetch(baseUrl + 'media/' + id);
      return tiedosto;
    } catch (e) {
      console.log('loadSingleMedia', e.message);
      return {};
    }
  };

  const uploadMedia = async (formData, token) => {
    try {
      setLoading(true);
      const options = {
        method: 'POST',
        headers: {
          'x-access-token': token,
        },
        body: formData,
      };
      const result = await doFetch(baseUrl + 'media', options);
      return result;
    } catch (e) {
      console.log('uploadMedia error', e);
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const modifyMedia = async (data, token, id) => {
    try {
      setLoading(true);
      const options = {
        method: 'PUT',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const result = await doFetch(baseUrl + 'media/' + id, options);
      return result;
    } catch (e) {
      console.log('uploadMedia error', e);
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (id, token) => {
    try {
      setLoading(true);
      const options = {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
        },
      };
      const result = await doFetch(baseUrl + 'media/' + id, options);
      return result;
    } catch (e) {
      console.log('deleteMedia error', e);
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    mediaArray,
    searchMediaArray,
    loading,
    loadMedia,
    loadSingleMedia,
    uploadMedia,
    deleteMedia,
    modifyMedia,
    searchMedia,
  };
};

const useLogin = () => {
  const login = async (userCredentials) => {
    const requestOptions = {
      method: 'POST',
      // mode: 'no-cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      const loginResponse = await doFetch(baseUrl + 'login', requestOptions);
      return loginResponse;
    } catch (error) {
      console.log('login error', error.message);
    }
  };
  return {login};
};

const register = async (inputs) => {
  inputs = {...inputs, full_name: JSON.stringify(inputs.full_name)};
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inputs),
  };
  try {
    const response = await fetch(baseUrl + 'users', fetchOptions);
    const json = await response.json();
    return json;
  } catch (e) {
    console.log('ApiHooks register', e.message);
    return false;
  }
};

const useUser = () => {
  const checkToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const userInfo = await doFetch(baseUrl + 'users/user', options);
      return userInfo;
    } catch (error) {
      console.log('checkToken error ', error);
    }
  };

  const getUserInfo = async (userid, token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const userInfo = await doFetch(baseUrl + 'users/' + userid, options);
      return userInfo;
    } catch (error) {
      console.log('checkToken error ', error);
    }
  };

  const modifyUserInfo = async (data, token) => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const result = await doFetch(baseUrl + 'users', options);
      return result;
    } catch (e) {
      console.log('modifyUserInfo error', e);
      throw new Error(e.message);
    }
  };

  const getAllUsers = async (token) => {
    // console.log('SAAPUIKO TOKEN? ', token);
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const allUserInfo = await doFetch(baseUrl + 'users', options);
      // console.log('ALL USER INFO: ', allUserInfo);
      return allUserInfo;
    } catch (error) {
      console.log('getAllUsers error ', error);
    }
  };

  const checkUsernameAvailable = async (username) => {
    try {
      const userNameInfo = await doFetch(
        baseUrl + 'users/username/' + username
      );
      return userNameInfo.available;
    } catch (error) {
      console.log('checkToken error ', error);
    }
  };

  return {
    checkToken,
    checkUsernameAvailable,
    getUserInfo,
    modifyUserInfo,
    getAllUsers,
  };
};

const useTag = () => {
  // const [loading, setLoading] = useState(false);

  const getFilesByTag = async (tag) => {
    try {
      const tiedosto = await doFetch(baseUrl + 'tags/' + tag);
      return tiedosto;
    } catch (e) {
      console.log('getFilesByTag', e.message);
      return {};
    }
  };

  // eslint-disable-next-line camelcase
  const addTag = async (file_id, tag, token) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({file_id, tag}),
    };
    // console.log('optiot', options);
    try {
      const tagInfo = await doFetch(baseUrl + 'tags', options);
      return tagInfo;
    } catch (error) {
      // console.log('addTag error', error);
      throw new Error(error.message);
    }
  };

  const deleteTag = async (fileId, token) => {
    // delete /favourites/file/:id
    try {
      // setLoading(true);
      const options = {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
        },
      };
      const result = await doFetch(baseUrl + 'tags/' + fileId, options);
      return result;
    } catch (e) {
      console.log('deleteTag error', e);
      throw new Error(e.message);
    } finally {
      // setLoading(false);
    }
  };

  return {getFilesByTag, addTag, deleteTag};
};

const useFavourites = () => {
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line camelcase
  const addFavourite = async (file_id, token) => {
    // post /favourites
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({file_id}),
    };
    console.log('optiot', options);
    try {
      const favouriteInfo = await doFetch(baseUrl + 'favourites', options);
      console.log('Favoriitti: ', favouriteInfo);
      return favouriteInfo;
    } catch (error) {
      // console.log('addTag error', error);
      throw new Error(error.message);
    }
  };

  const deleteFavourite = async (fileId, token) => {
    // delete /favourites/file/:id
    try {
      setLoading(true);
      const options = {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
        },
      };
      const result = await doFetch(
        baseUrl + 'favourites/file/' + fileId,
        options
      );
      return result;
    } catch (e) {
      console.log('deleteFavourite error', e);
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getFavouritesByFileID = async (fileId) => {
    // get /favourites/file/:id
    const options = {
      method: 'GET',

      // body: JSON.stringify({fileId}),
    };
    try {
      const idInfo = await doFetch(
        baseUrl + 'favourites/file/' + fileId,
        options
      );
      console.log('LIKING ID INFO:', idInfo);
      return idInfo;
    } catch (error) {
      console.log('getFavourites by fileiD error ', error);
    }
  };

  const getMyFavourites = async (token) => {
    // get /favourites
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const favouriteInfo = await doFetch(baseUrl + 'favourites', options);
      return favouriteInfo;
    } catch (error) {
      console.log('GetMyFavourites by fileiD error ', error);
    }
  };

  return {
    loading,
    addFavourite,
    deleteFavourite,
    getFavouritesByFileID,
    getMyFavourites,
  };
};

export {useMedia, useLogin, useUser, register, useTag, useFavourites};
