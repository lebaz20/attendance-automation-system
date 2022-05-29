/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

import Home from './app/Home';
import Demo from './app/Demo';

const App: () => React$Node = () => {
  const [page, setPage] = React.useState("home");

  return (
    <PaperProvider theme={{ ...DefaultTheme, dark: true, mode: 'adaptive'}}>
      <View style={styles.container}>
        {page === "home" && <Home setPage={setPage} />}
        {page === "demo" && <Demo setPage={setPage} />}
      </View>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
    padding: '10%'
  },
});
