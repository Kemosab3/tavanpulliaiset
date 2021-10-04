import React from 'react';
// import Home from './views/Home';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <MainProvider>
          <Navigator />
        </MainProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
