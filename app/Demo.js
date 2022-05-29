import * as React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Headline, TextInput, Button } from 'react-native-paper';
import BluetoothList from './BluetoothScanner';
import ScheduleSetter from './ScheduleSetter';

const Separator = () => (
  <View style={styles.separator} />
);

const Demo = ({ setPage }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [step, setStep] = React.useState(1);
  const [payload, setPayload] = React.useState({});

  return (
    <SafeAreaView>
      <View style={styles.body}>
        <Headline style={styles.headline}>
          Demo
        </Headline>

        {step === 1 && <BluetoothList setPage={setPage} setStep={setStep} setPayload={setPayload} payload={payload} />}
        {step === 2 && <ScheduleSetter setStep={setStep} setPayload={setPayload} payload={payload} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    height: "100%",
  },
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