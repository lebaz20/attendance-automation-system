import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline, TextInput, Button } from 'react-native-paper';

const Separator = () => (
  <View style={styles.separator} />
);

const Home = ({ setPage }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <>
      <Headline style={styles.headline}>AAS Attendance Automation System</Headline>

      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        type="email"
        onChangeText={email => setEmail(email)}
      />
      <Separator />
      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        secureTextEntry={true}
        type="password"
        onChangeText={password => setPassword(password)}
      />
      <Separator />
      <Button mode="outlined" onPress={() => {}}>
        Sign in
      </Button>
      <Separator />
      <Button mode="outlined" onPress={() => {}}>
        Sign up
      </Button>
      <Separator />
      <Button icon="test-tube" mode="outlined" onPress={() => setPage('demo')}>
        Demo
      </Button>
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

export default Home;