import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//Screen dimensions
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
//Images
import marathon_logo from '../../assets/images/marathon_logo.png';
import background_image from '../../assets/images/app-bg.png';

const Login = ({navigation}) => {
  const [code, setCode] = useState('');
  const [nip, setNip] = useState('');
  const [response, setResponse] = useState([1, 2]);
  const [inputActive, setInputActive] = useState('');

  const getLocalData = async () => {
    let localData = await AsyncStorage.getItem('token');
    console.log(localData);
    if (localData) {
      const token = JSON.parse(localData);
      navigation.reset({
        index: 0,
        routes: [{
          name: 'Home',
          params: {
            token: token,
            openColor: '#16369C',
            interfaceColor: '#1E202F',
          }
        }]
      });
    }
  };

  useEffect(() => {
    getLocalData();
  }, []);

  const insertUserOnDB = (code, name) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log('Registro insertado correctamente -- ', xhttp.responseText);
      }
    };
    xhttp.open(
      'GET',
      ` https://tempbackend.000webhostapp.com/Alta.php?codigo=${code}&nombre=${name}`,
      true,
    );
    xhttp.send();
  };

  const getResult = async () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (xhttp.responseText === '0') {
          setResponse([]);
          Alert.alert(
            'Credenciales inválidas.',
            'Código de alumno y/o NIP inexistentes. Por favor vuelve a ingresar tus datos.',
            [
              {
                text: 'Ok',
              },
            ],
          );
        } else {
          let responseSplited = xhttp.responseText.split(',');
          setResponse(responseSplited);
          AsyncStorage.setItem(
            'token',
            JSON.stringify({
              nombre: responseSplited[2],
              code: responseSplited[1],
              carrera: responseSplited[4],
            }),
          );
          insertUserOnDB(responseSplited[1], responseSplited[2]);
          navigation.reset({
            index: 0,
            routes: [{
              name: 'Home',
              params: {
                token: xhttp.responseText.split(','),
                openColor: '#16369C',
                interfaceColor: '#1E202F',
              }
            }]
          });
        }
      }
    };
    xhttp.open(
      'GET',
      ` http://cuceimobile.tech/Escuela/datosudeg.php?codigo=${code}&nip=${nip}`,
      true,
    );
    xhttp.send();
  };
  return (
    <SafeAreaView style={estilos.mainContainer}>
      <ImageBackground
        source={background_image}
        style={estilos.backgroundImage}>
        <Image style={{width: 200, height: 200}} source={marathon_logo} />
        <Text style={{...estilos.titulo, marginTop: 10}}>INGRESO</Text>
        <View style={estilos.inputContainer}>
          <TextInput
            onFocus={() => {
              setInputActive('inOne');
            }}
            onEndEditing={() => {
              setInputActive('');
            }}
            selectionColor="#3CC2B1"
            style={{
              ...estilos.inputStyle,
              borderColor: inputActive === 'inOne' ? '#3CC2B1' : 'white',
              backgroundColor: inputActive === 'inOne' ? '#16369C' : '#000E5B',
            }}
            onChangeText={value => {
              setCode(value);
              console.log(value);
            }}
            placeholder="Código"
            placeholderTextColor="rgb(220, 220, 220)"
            keyboardType="numeric"
          />
          <TextInput
            onFocus={() => {
              setInputActive('inTwo');
            }}
            onEndEditing={() => {
              setInputActive('');
            }}
            selectionColor="#3CC2B1"
            style={{
              ...estilos.inputStyle,
              borderColor: inputActive === 'inTwo' ? '#3CC2B1' : 'white',
              backgroundColor: inputActive === 'inTwo' ? '#16369C' : '#000E5B',
            }}
            onChangeText={value => {
              setNip(value);
            }}
            placeholder="NIP"
            keyboardType="default"
            placeholderTextColor="rgb(220, 220, 220)"
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          style={estilos.buttonStyle}
          onPress={() => {
            getResult();
          }}>
          <Text style={{...estilos.subtitulo, color: 'white'}}>ENTRAR</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
  backgroundImage: {
    marginLeft: 10,
    height: screenHeight * 1.25,
    width: screenWidth * 1.25,
    resizeMode: 'cover',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: screenWidth * 0.25,
    paddingRight: screenWidth * 0.25,
    paddingTop: screenHeight * 0.15,
  },
  mainContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontFamily: 'Arial',
    fontWeight: '100',
    fontSize: 38,
    padding: 10,
    color: 'white',
    letterSpacing: 10,
  },
  subtitulo: {
    marginTop: 5,
    fontFamily: 'Arial',
    fontWeight: '100',
    fontSize: 20,
    color: '#7F8485',
    letterSpacing: 5,
  },
  inputContainer: {
    width: '100%',
    height: 150,
    marginTop: 25,
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inputStyle: {
    width: '80%',
    borderRadius: 25,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 7,
    color: 'white',
    fontSize: 18,
  },
  buttonStyle: {
    width: 'auto',
    borderRadius: 35,
    paddingHorizontal: 35,
    paddingVertical: 8,
    backgroundColor: '#3CC2B1',
    marginTop: 30,
  },
  animatedBox: {
    flex: 1,
    backgroundColor: '#3CC2B1',
    padding: 15,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonHigh: {
    padding: 10,
    marginTop: 10,
    width: '100%',
    borderRadius: 15,
  },
  avatar: {
    borderRadius: 30,
    borderColor: '#533415',
    borderWidth: 2,
  },
});

export default Login;
