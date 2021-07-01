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
import {Icon} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
//My API
import AxiosApp from '../../api/axiosApp';
//Screen dimensions
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
//Images
import background_image from '../../assets/images/app-bg.png';
import ProfileDef from '../../assets/images/profile_default.png';
import Working from '../../assets/images/working-cartoon.jpg';

const Try = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [imageToSend, setImageToSend] = useState('');
  const [tries, setTries] = useState();
  const [pendingAprove, setPendingAprove] = useState(false);
  const [resourcePath, setResourcePath] = useState('');
  const [inputActive, setInputActive] = useState('');

  const getLocalData = async () => {
    let localData = await AsyncStorage.getItem('token');
    console.log(localData);
    if (localData) {
      const token = JSON.parse(localData);
      setUserData(token);
    }
  };

  const getStudentTries = async () => {
    await AxiosApp.get(`alumnos/${userData.code}`).then(res => {
      console.log(res.data);
      if (res.data && res.data.length > 0) {
        setTries(res.data);
        for (const studentIndex in res.data) {
          if (res.data[studentIndex].status == 1) {
            setPendingAprove(true);
          }
        }
      }
    });
  };

  useEffect(() => {
    getLocalData();
    getStudentTries();
  }, []);

  const selectFile = async () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose file from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, async res => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        setResourcePath(source.uri);
        const response = await fetch(source.uri);
        const blob = await response.blob();
        var reader = new FileReader();
        reader.onload = () => {
          var InsertAPI = 'http://tempbackend.000webhostapp.com/upload.php';
          var Data = {img: reader.result};
          var headers = {
            Accept: 'application/json',
            'Content-Type': 'application.json',
          };
          fetch(InsertAPI, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data),
          })
            .then(response => response.json())
            .then(response => {
              console.log('server try' + response);
              setImageToSend(
                `http://tempbackend.000webhostapp.com/${response}`,
              );
            })
            .catch(err => {
              console.log('Holi error: ', err);
            });
        };
        reader.readAsDataURL(blob);
      }
    });
  };

  const validateEmptyFields = obj => {
    for (const key in obj) {
      if (!obj[key]) return false;
    }
    return true;
  };

  const sendTry = async () => {
    const dataToSend = {
      name: userData.nombre,
      code: userData.code,
      career: userData.carrera,
      minutes: time,
      meters: distance,
      evidence: imageToSend,
    };

    if (!validateEmptyFields(dataToSend)) {
      return Alert.alert(
        'Campos vacíos.',
        'Asegurate de completar todos los campos que se te piden.',
        [
          {
            text: 'Entendido',
          },
        ],
      );
    }
    await AxiosApp.post('alumnos/addTry', dataToSend)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => console.log(error));
    await getStudentTries();
  };

  return (
    <SafeAreaView style={estilos.mainContainer}>
      <ImageBackground
        source={background_image}
        style={estilos.backgroundImage}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon
            iconStyle={{fontSize: 40}}
            containerStyle={{marginTop: 5}}
            name="arrow-left"
            type="feather"
            color="white"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Home',
                    params: {
                      token: userData,
                      openColor: '#16369C',
                      interfaceColor: '#1E202F',
                    },
                  },
                ],
              })
            }
          />
          <Text style={{...estilos.titulo}}>REGISTRAR INTENTO</Text>
        </View>
        {!pendingAprove ? (
          <View>
            <View style={estilos.inputContainer}>
              <Text
                style={{
                  ...estilos.subtitulo,
                  color: inputActive === 'inOne' ? '#3CC2B1' : 'white',
                }}>
                DISTANCIA RECORRIDA
              </Text>
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
                  backgroundColor:
                    inputActive === 'inOne' ? '#16369C' : '#000E5B',
                }}
                onChangeText={value => {
                  setDistance(value);
                  console.log(value);
                }}
                placeholder="Disntancia en metros"
                placeholderTextColor="rgb(220, 220, 220)"
                keyboardType="numeric"
              />
              <Text
                style={{
                  ...estilos.subtitulo,
                  color: inputActive === 'inTwo' ? '#3CC2B1' : 'white',
                }}>
                TIEMPO HECHO
              </Text>
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
                  backgroundColor:
                    inputActive === 'inTwo' ? '#16369C' : '#000E5B',
                }}
                onChangeText={value => {
                  setTime(value);
                }}
                placeholder="Tiempo en minutos"
                keyboardType="numeric"
                placeholderTextColor="rgb(220, 220, 220)"
              />
            </View>
            <Text
              style={{
                ...estilos.subtitulo,
                color: inputActive === 'inTwo' ? '#3CC2B1' : 'white',
              }}>
              EVIDENCIA
            </Text>
            <TouchableOpacity
              onPress={selectFile}
              style={{
                marginTop: 10,
                ...estilos.avatar,
                borderWidth: 0,
              }}>
              {!resourcePath ? (
                <View
                  style={{
                    ...estilos.avatar,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: 30,
                  }}>
                  <Text style={{...estilos.subtitulo, color: '#3CC2B1'}}>
                    SELECCIONAR
                  </Text>
                  <Icon
                    iconStyle={{fontSize: 50}}
                    type="font-awesome"
                    name="camera-retro"
                    color="#3CC2B1"
                  />
                </View>
              ) : (
                <Image
                  style={{
                    width: screenWidth * 0.75,
                    height: screenWidth * 0.75,
                    ...estilos.avatar,
                  }}
                  source={resourcePath ? {uri: resourcePath} : ProfileDef}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={estilos.buttonStyle} onPress={sendTry}>
              <Text
                style={{...estilos.subtitulo, color: 'white', marginTop: 0}}>
                ENVIAR
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text
              style={{
                ...estilos.subtitulo,
                color: '#3CC2B1',
              }}>
              REGISTRO PENDIENTE
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 12,
                color: 'white',
                fontWeight: '500',
              }}>
              Tienes un registro pendiente por aprovar, por lo que no podrás
              voler a ingresar un intento hasta que los administradores tomen
              una acción: Si se aprueba entonces verás los cambios reflejados en
              el ranking, sino entonces solamente el formulario volverá a
              aparecer en esta ventana.
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 16,
                color: 'white',
                fontWeight: '300',
                textAlign: 'center',
              }}>
              ¡Mucha Suerte!
            </Text>
            <Image
              style={{
                width: screenWidth * 0.75,
                height: screenWidth * 0.75,
                marginTop: 25,
                ...estilos.avatar,
              }}
              source={Working}
            />
          </View>
        )}
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
    fontSize: 28,
    color: 'white',
    letterSpacing: 10,
    textAlign: 'center',
  },
  subtitulo: {
    marginTop: 12,
    fontFamily: 'Arial',
    fontWeight: '100',
    fontSize: 20,
    color: '#7F8485',
    letterSpacing: 5,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginTop: 25,
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inputStyle: {
    width: '90%',
    borderRadius: 25,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 7,
    color: 'white',
    fontSize: 18,
    marginTop: 4,
  },
  buttonStyle: {
    width: 'auto',
    borderRadius: 35,
    paddingHorizontal: 35,
    paddingVertical: 8,
    backgroundColor: '#3CC2B1',
    marginTop: 15,
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
    borderColor: '#3CC2B1',
    borderWidth: 4,
    width: screenWidth * 0.75,
    height: screenWidth * 0.6,
  },
});

export default Try;
