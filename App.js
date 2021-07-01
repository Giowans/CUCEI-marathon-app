import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
//Screens
import Login from './src/screens/Login/Login';
import Home from './src/screens/Home/Home';
import Try from './src/screens/Try/Try';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [token, setToken] = useState({});

  const getLocalData = async () => {
    let localData = await AsyncStorage.getItem('token');
    console.log(localData);
    if (localData) {
      const token = JSON.parse(localData);
      setToken(token);
      setInitialRoute('Home');
    }
  };

  useEffect(() => {
    getLocalData();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        {/**Home Screen*/}
        <Stack.Screen
          name="Home"
          component={Home}
          initialParams={{
            token: token,
            openColor: '#16369C',
            interfaceColor: '#1E202F',
          }}
          options={{
            headerShown: false,
          }}
        />
        {/**Home Screen*/}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        {/**Home Screen*/}
        <Stack.Screen
          name="Try"
          component={Try}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
