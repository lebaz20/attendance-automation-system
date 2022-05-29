import React, {Component } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Headline, TextInput, Button, Snackbar } from 'react-native-paper';

import { Alert, Platform } from 'react-native';
import { NativeEventEmitter, NativeModules } from 'react-native';

import update from 'immutability-helper';
import BLEAdvertiser from 'react-native-ble-advertiser'
import UUIDGenerator from 'react-native-uuid-generator';
import { PermissionsAndroid } from 'react-native';

// Uses the Apple code to pick up iPhones
const APPLE_ID = 0x4C;
const MANUF_DATA = [1,0];

BLEAdvertiser.setCompanyId(APPLE_ID); 

const Separator = () => (
  <View style={styles.separator} />
);

export async function requestLocationPermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'AAS App',
          'message': 'AAS App access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('[Permissions]', 'Location Permission granted')
      } else {
        console.log('[Permissions]', 'Location Permission denied')
      }
    }

    const blueoothActive = await BLEAdvertiser.getAdapterState().then(result => {
      console.log('[Bluetooth]', 'Bluetooth Status', result)
      return result === "STATE_ON";
    }).catch(error => { 
      console.log('[Bluetooth]', 'Bluetooth Not Enabled')
      return false;
    });

    if (!blueoothActive) {
      await Alert.alert(
        'AAS requires bluetooth to be enabled',
        'Would you like to enable Bluetooth?',
        [
          {
            text: 'Yes',
            onPress: () => BLEAdvertiser.enableAdapter(),
          },
          {
            text: 'No',
            onPress: () => console.log('Do Not Enable Bluetooth Pressed'),
            style: 'cancel',
          },
        ],
      )
    }
  } catch (err) {
    console.warn(err)
  }
}

class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid:'',
            selectedDevice:'',
            isLogging: false,
            devicesFound:[]
        }
    }

    addDevice(_uuid, _name, _mac, _rssi, _date) {
      if (!_name) {
        return;
      }
      const index = this.state.devicesFound.findIndex( ({ name }) => name == _name);
      if (index<0) {
        this.setState({
          devicesFound: [ ...this.state.devicesFound, {uuid:_uuid, name:_name, mac: _mac, rssi:_rssi, start:_date, end:_date}]
        });
      } else {
        this.setState({
          devicesFound: update(this.state.devicesFound, 
            {[index]: {end: {$set: _date}, rssi: {$set: _rssi || this.state.devicesFound[index].rssi }}}
          )
        });
      }
    }

    componentDidMount(){
      requestLocationPermission();
      
      UUIDGenerator.getRandomUUID((newUid) => {
        this.setState({
          uuid: newUid.slice(0, -2) + '00'
        });
      });
    }

    componentWillUnmount() {
      if (this.state.isLogging)
        this.stop();
    }

    start() {
      console.log(this.state.uuid, "Registering Listener");
      const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);

      this.onDeviceFound = eventEmitter.addListener('onDeviceFound', (event) => {
        // onDeviceFound {"deviceAddress": null, "deviceName": "[TV] Samsung Q80AA 55 TV", "rssi": -59, "serviceUuids": []}
        if (event.serviceUuids.length) {
          for(let i=0; i< event.serviceUuids.length; i++){
            if (event.serviceUuids[i] && event.serviceUuids[i].endsWith('00'))
              this.addDevice(event.serviceUuids[i], event.deviceName, event.deviceAddress, event.rssi, new Date())   
          }
        } else {
          console.log('onDeviceFoundonDeviceFoundonDeviceFoundonDeviceFound')
          this.addDevice('', event.deviceName, event.deviceAddress, event.rssi, new Date())   
        }
      });

      console.log(this.state.uuid, "Starting Advertising");
      BLEAdvertiser.broadcast(this.state.uuid, MANUF_DATA, {
        advertiseMode: BLEAdvertiser.ADVERTISE_MODE_BALANCED, 
        txPowerLevel: BLEAdvertiser.ADVERTISE_TX_POWER_MEDIUM, 
        connectable: false, 
        includeDeviceName: false, includeTxPowerLevel: false })
        .then(sucess => console.log(this.state.uuid, "Adv Successful", sucess))
        .catch(error => console.log(this.state.uuid, "Adv Error", error));
      
      console.log(this.state.uuid, "Starting Scanner");
      BLEAdvertiser.scan(MANUF_DATA, {scanMode: BLEAdvertiser.SCAN_MODE_LOW_LATENCY})
        .then(sucess => console.log(this.state.uuid, "Scan Successful", sucess))
        .catch(error => console.log(this.state.uuid, "Scan Error", error));

      this.setState({
        isLogging: true,
      });
    }

    stop(){
      console.log(this.state.uuid, "Removing Listener");
      this.onDeviceFound.remove();
      delete this.onDeviceFound;

      console.log(this.state.uuid, "Stopping Broadcast");
      BLEAdvertiser.stopBroadcast()
        .then(sucess => console.log(this.state.uuid, "Stop Broadcast Successful", sucess))
        .catch(error => console.log(this.state.uuid, "Stop Broadcast Error", error));

      console.log(this.state.uuid, "Stopping Scanning");
      BLEAdvertiser.stopScan()
        .then(sucess => console.log(this.state.uuid, "Stop Scan Successful", sucess) )
        .catch(error => console.log(this.state.uuid, "Stop Scan Error", error) );

      this.setState({
        isLogging: false,
      });
    }

    short(str) {
      return (str.substring(0, 4) + " ... " + str.substring(str.length-4, str.length)).toUpperCase(); 
    }

    render() {
      return (
        <>
          <View style={styles.sectionContainer}>
            {/* <Text style={styles.sectionTitle}>BLE Advertiser Demo</Text> */}
            <Text style={styles.sectionDescription}>Simulate attendance recording.</Text>
          </View>

          <View style={styles.sectionContainer}>
            {this.state.isLogging ? (
            <Button
              onPress={() => this.stop()}
              mode="contained"
              color="red"
            >
              Stop
            </Button>
              ) : (
            <Button
              onPress={() => this.start()}
              mode="contained"
              icon="bluetooth-connect"
            >
              List bluetooth devices
            </Button>
            )}
          </View>

          <View style={styles.sectionContainerFlex}>
            <Text style={styles.sectionTitle}>Devices Around</Text>
            <FlatList
                data={ this.state.devicesFound }
                renderItem={({item}) => <Button onPress={() => {
                  // this.stop()
                  this.setState({ selectedDevice: item.name }) 
                }} mode={item.name === this.state.selectedDevice ? 'contained': 'default'} style={styles.itemPastConnections}>{item.name}</Button>}
                keyExtractor={item => item.name}
                />
          </View>

          <Snackbar
            style={styles.snackbar}
            visible={!!this.state.selectedDevice}
            onDismiss={() => {
              this.setState({ selectedDevice: '' })
            }}
            action={{
              label: 'Dismiss',
              onPress: () => {
                this.setState({ selectedDevice: '' })
              },
            }}
          >
            Attendance recorded for MOT-622 on {new Date().toDateString()}.
          </Snackbar>
          <View style={styles.sectionContainer}>
            
            <Button icon="chevron-left" mode="contained" onPress={() => this.props.setPage('home')} >Home</Button>
          </View>
        </>
      );
    }
}

const styles = StyleSheet.create({
  body: {
    height: "100%",
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
  },
  bottomButtons: {
    flex: 1,
  },
  sectionContainerFlex: {
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  snackbar: {
    marginBottom: 64,
  },
  sectionContainer: {
    flex: 0,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center'
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  highlight: {
    fontWeight: '700',
  },
  startLoggingButtonTouchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    height: 52,
    alignSelf: 'center',
    width: 300,
    justifyContent: 'center',
  },
  startLoggingButtonText: {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  stopLoggingButtonTouchable: {
    borderRadius: 12,
    backgroundColor: '#fd4a4a',
    height: 52,
    alignSelf: 'center',
    width: 300,
    justifyContent: 'center',
  },
  stopLoggingButtonText: {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  listPastConnections: {
      width: "80%",
      height: 200
  },
  itemPastConnections: {
      padding: 3,
      fontSize: 18,
      fontWeight: '400',
  },
  separator: {
    marginVertical: 8,
    // borderBottomColor: '#737373',
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Entry;
