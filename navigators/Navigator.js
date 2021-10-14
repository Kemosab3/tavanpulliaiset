/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon} from 'react-native-elements';
import Upload from '../views/Upload';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';
import EditProfile from '../views/EditProfile';
import Search from '../views/Search';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="My Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Single"
        component={Single}
        options={{
          title: '',
          headerStyle: {
            title: '',
            backgroundColor: 'black',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="My Profile"
        component={Profile}
        options={{
          title: '',
          headerShown: false,
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />
      <Stack.Screen
        name="My Files"
        component={MyFiles}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />
      <Stack.Screen
        name="Single"
        component={Single}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />
      <Stack.Screen
        name="Modify"
        component={Modify}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'black',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const TabScreen = () => {
  return (
    <Tab.Navigator
      shifting={true}
      barStyle={{backgroundColor: '#FF6700'}}
      activeColor="white"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Profile':
              iconName = 'account-box';
              break;
            case 'Upload':
              iconName = 'cloud-upload';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Search" component={Search} hideNavigationBar={false} />
      <Tab.Screen name="Upload" component={Upload} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Front"
            component={TabScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
