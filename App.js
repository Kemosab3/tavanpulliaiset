import React from 'react';
import {StyleSheet, Platform, StatusBar} from 'react-native';
// import Home from './views/Home';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <MainProvider>
        <PaperProvider>
          <Navigator />
        </PaperProvider>
      </MainProvider>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});

export default App;
