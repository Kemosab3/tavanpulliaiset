import React from 'react';
// import Home from './views/Home';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <MainProvider>
        <Navigator />
      </MainProvider>
    </SafeAreaProvider>
  );
};

export default App;
