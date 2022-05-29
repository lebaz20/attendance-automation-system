import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline, TextInput, Button } from 'react-native-paper';
import BluetoothList from './ble';

const Separator = () => (
  <View style={styles.separator} />
);

const Demo = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [shouldLoadBluetoothList, loadBluetoothList] = React.useState(false);

  return (
    <>  
      <Headline style={styles.headline}>AAS Attendance Automation System - Demo</Headline>

      {shouldLoadBluetoothList? <BluetoothList loadBluetoothList={loadBluetoothList} />:
      <>
        <Button icon="bluetooth-connect" mode="outlined" onPress={() => loadBluetoothList(true)}>
          List bluetooth devices
        </Button>
      </>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headline: {
    textAlign: 'center',
  },
  separator: {
    marginVertical: 8,
    // borderBottomColor: '#737373',
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Demo;