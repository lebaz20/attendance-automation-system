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
import { Headline, TextInput, Button } from 'react-native-paper';

import { Alert, Platform } from 'react-native';

const Separator = () => (
  <View style={styles.separator} />
);

class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {
          schedule: {}
        }
    }

    componentDidMount(){
    }

    componentWillUnmount() {
    }

    updateScheduleField(entryIndex, fieldName, value) {
      this.setState({ schedule: {...schedule, [entryIndex]: {...schedule[entryIndex], [fieldName]: value}}})
    }

    removeScheduleEntry(entryIndex) {
      const scheduleClone = {...this.state.schedule}
      delete scheduleClone[entryIndex]
      this.setState({ schedule: scheduleClone })
    }

    addScheduleEntry() {
      const scheduleClone = {...this.state.schedule}
      const entriesCount = Object.keys(scheduleClone).length
      scheduleClone[entriesCount] = {
        course: '',
        room: '',
        day: '',
        startTime: '',
        endTime: '',
      }
      this.setState({ schedule: scheduleClone })
    }

    renderForm(entryIndex) {
      const schedule = this.state.schedule[entryIndex]

      return (
        <>
          <TextInput
            mode="outlined"
            label="Course"
            value={schedule.course}
            onChangeText={course => this.updateScheduleField(entryIndex, 'course', course)}
          />
          <TextInput
            mode="outlined"
            label="Room"
            value={schedule.room}
            onChangeText={room => this.updateScheduleField(entryIndex, 'room', room)}
          />
          <TextInput
            mode="outlined"
            label="Day"
            value={schedule.day}
            onChangeText={day => this.updateScheduleField(entryIndex, 'day', day)}
          />
          <TextInput
            mode="outlined"
            label="Start time"
            value={schedule.startTime}
            onChangeText={startTime => this.updateScheduleField(entryIndex, 'startTime', startTime)}
          />
          <TextInput
            mode="outlined"
            label="End time"
            value={schedule.endTime}
            onChangeText={endTime => this.updateScheduleField(entryIndex, 'endTime', endTime)}
          />
          <Separator />
          <Button icon="minus" mode="contained" onPress={() => this.removeScheduleEntry(entryIndex)}>
            Remove
          </Button>
        </>
      )
    }

    render() {
      return (
        <>
          <View style={styles.sectionContainer}>
            {/* <Text style={styles.sectionTitle}>BLE Advertiser Demo</Text> */}
            <Text style={styles.sectionDescription}>Insert a schedule entry to compare against current location and time.</Text>
          </View>

          <ScrollView style={styles.sectionContainerFlex}>
            {Object.keys(this.state.schedule).map((key) => (
              <>
                {this.renderForm(key)}
              </>
            ))}
            <Separator />
            <Button icon="plus" mode="contained" onPress={() => this.addScheduleEntry()}>
              Add
            </Button>
          </ScrollView>

          <View style={styles.sectionContainer}>
            <Separator />
            <View style={styles.bottomButtonsContainer}>
              <Button icon="chevron-left" style={styles.bottomButtons}  onPress={() => {
                  this.props.setStep(1) 
                }} 
              >
                Back
              </Button>
              <Button
                icon="chevron-right" style={styles.bottomButtons} onPress={() => {
                  this.props.setStep(3) 
                  this.props.setPayload({ ...this.props.payload, selectedDevice: this.state.selectedDevice, devicesFound: this.state.devicesFound }) 
                }}
              >
                Next
              </Button>
            </View>
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
