import * as React from 'react';
import { View, NativeEventEmitter, NativeModules } from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider, ActivityIndicator, Colors } from 'react-native-paper';
import BLEAdvertiser from 'react-native-ble-advertiser'
import {BleError, BleManager, Device} from 'react-native-ble-plx';

const LoadingDevices = () => (
  <ActivityIndicator animating={true} color={Colors.red800} />
);

const BluetoothList = () => {
  const bleManager = new BleManager();
  const [visible, setVisible] = React.useState(false);
  const [devices, setDevices] = React.useState({});


  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  React.useEffect(() => {
    // const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
    // eventEmitter.addListener('onDeviceFound', (deviceData) => {
    //     console.log(deviceData);
    // });
    // BLEAdvertiser.setCompanyId(0x00); // Your Company's Code
    // BLEAdvertiser.scanByService([], {}) // service UUID and options
    //     .then(success => console.log("Scan Successful", success))
    //     .catch(error => console.log("Scan Error", error)); 

    bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        return console.log("Scan Error", error);
      }
      return console.log("Scan Successful", scannedDevice);
    });

    return () => bleManager.stopDeviceScan()
    }, [])  

  return (
    <Provider>
      <View>
        {!devices && visible === false && <LoadingDevices />}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Paragraph>This is simple dialog}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

export default BluetoothList;