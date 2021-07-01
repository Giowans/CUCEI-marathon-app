import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import MenuDrawer from 'react-native-side-drawer';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ProfileDef from '../../assets/images/profile_default.png';
import RankingCard from './components/RankingCard';
import ProgressBar from 'react-native-progress/Bar';
import Fireworks from './components/Fireworks';

//Screen dimensions
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

//Images
import background_image from '../../assets/images/app-bg.png';
import cucei_horizontal from '../../assets/images/cucei_horizontal.png';
import axiosApp from '../../api/axiosApp';

const Home = ({route, navigation, initialParams}) => {
  const {token, interfaceColor, openColor} = route.params || initialParams;
  const [showingDrawer, setShowingDrawer] = useState(false);
  const [resourcePath, setResourcePath] = useState('');
  const [students, setStudents] = useState([]);
  const [topThree, setTopThree] = useState([]);
  const [myInfo, setMyInfo] = useState({
    fecha: '27-06-2021',
    Distancia: 1,
    position: 1,
  });

  const estilos = StyleSheet.create({
    backgroundImage: {
      marginLeft: 10,
      height: screenHeight * 1.25,
      width: screenWidth * 1.25,
      resizeMode: 'cover',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: screenWidth * 0.15,
      paddingRight: screenWidth * 0.15,
      paddingTop: screenHeight * 0.05,
      opacity: myInfo.position === 0 ? 0.7 : 1,
    },
    mainContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titulo: {
      fontFamily: 'Arial',
      fontWeight: '400',
      fontSize: 38,
      padding: 10,
      color: 'white',
    },
    subtitulo: {
      marginTop: 5,
      fontFamily: 'Arial',
      fontWeight: '100',
      fontSize: 18,
      color: '#7F8485',
    },
    inputContainer: {
      width: '100%',
      height: 100,
      marginTop: 25,
      display: 'flex',
      flexDirection: 'column',
      paddingHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    inputStyle: {
      width: '80%',
      borderRadius: 10,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 5,
      color: 'black',
    },
    buttonStyle: {
      width: 'auto',
      borderRadius: 35,
      paddingHorizontal: 35,
      paddingVertical: 8,
      backgroundColor: interfaceColor,
      marginTop: 30,
    },
    animatedBox: {
      flex: 1,
      backgroundColor: interfaceColor,
      padding: 15,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonHigh: {
      paddingVertical: 13,
      paddingHorizontal: 18,
      marginTop: 10,
      borderRadius: 30,
    },
    avatar: {
      borderRadius: 80,
      borderColor: openColor,
      borderWidth: 4,
    },
  });

  const updateImageOnBD = (code, uriImage) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(
          'Imagen actualizada correctamente  -- ',
          xhttp.responseText,
        );
      }
    };
    xhttp.open(
      'GET',
      `https://tempbackend.000webhostapp.com/CambiaImagen.php?codigo=${code}&rutai=${uriImage}`,
      true,
    );
    xhttp.send();
  };

  const getStudentsByRank = async () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
        var students = JSON.parse(xhttp.responseText);
        setStudents(JSON.parse(xhttp.responseText));
        var top = students.slice(0, 3);
        var myPosition = students.findIndex(
          student => student.Codigo == token.code || student.Codigo == token[1],
        );
        var gotMyInfo = students.find(
          student => student.Codigo == token.code || student.Codigo == token[1],
        );
        console.log(myPosition + 1, myInfo, top);
        if (gotMyInfo) {
          gotMyInfo.position = myPosition;
          setMyInfo(gotMyInfo);
        }
        setTopThree(top);
      }
    };
    xhttp.open(
      'GET',
      `https://tempbackend.000webhostapp.com/getRanking.php`,
      true,
    );
    xhttp.send();
  };

  useEffect(() => {
    getStudentsByRank();
  }, [showingDrawer]);

  const toggleOpen = () => {
    setShowingDrawer(!showingDrawer);
  };

  const getValidDate = date => {
    var subDate = date.split('-');
    console.log(
      'valid date: ',
      `${subDate[2]}-${subDate[1]}-${
        subDate[0].length > 1 ? subDate[0] : '0' + subDate[0]
      }`,
    );
    return `${subDate[2]}-${subDate[1]}-${
      subDate[0].length > 1 ? subDate[0] : '0' + subDate[0]
    }`;
  };

  const daysBetween = (date1, date2) => {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    console.log('diferencia: ', date2, '-', date1);
    console.log('dias: ', difference_ms / one_day);
    // Convert back to days and return
    return 10 - Math.trunc(difference_ms / one_day);
  };

  const closeSession = async () => {
    await axiosApp.delete(`alumnos/${token[1] || token.code}`);
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

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
        setMyInfo({...myInfo, imagen: source.uri});
        const code = token[1] || token.code;
        await AsyncStorage.setItem(`${code}`, source.uri);
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
              console.log('server ' + response);
              updateImageOnBD(
                code,
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

  const drawerContent = () => {
    return (
      <View style={estilos.animatedBox}>
        <View style={estilos.mainContainer}>
          <Icon
            iconStyle={{fontSize: 40}}
            containerStyle={{alignSelf: 'flex-start'}}
            name="x"
            type="feather"
            color="white"
            onPress={toggleOpen}
          />
          <TouchableOpacity
            onPress={selectFile}
            style={{
              width: 150,
              height: 150,
              marginTop: 10,
              ...estilos.avatar,
              borderWidth: 0,
            }}>
            <Image
              style={{width: 150, height: 150, ...estilos.avatar}}
              source={myInfo.imagen ? {uri: myInfo.imagen} : ProfileDef}
            />
          </TouchableOpacity>
          <Text
            style={{
              ...estilos.titulo,
              fontSize: 15,
              color: 'white',
              marginTop: 8,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {token[2] || token.nombre || ''}
          </Text>
          <Text
            style={{
              ...estilos.subtitulo,
              fontSize: 13,
              color: 'white',
              fontStyle: 'italic',
              marginTop: 5,
            }}>
            {token[1] || token.code || ''} --- {token[4] || token.carrera || ''}
          </Text>
          <View style={{marginTop: 25}}>
            <Text
              style={{
                ...estilos.titulo,
                fontSize: 15,
                color: 'white',
                marginTop: 8,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Dia {daysBetween(new Date(), new Date(2021, 6, 6))} / 10
            </Text>
            <ProgressBar
              width={150}
              style={{marginTop: 5}}
              progress={daysBetween(new Date(), new Date(2021, 6, 6)) / 10}
              color={openColor}
            />

            <Text
              style={{
                ...estilos.titulo,
                fontSize: 15,
                color: 'white',
                marginTop: 8,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Kilometros recorridos
            </Text>
            <Text
              style={{
                ...estilos.titulo,
                fontSize: 12,
                color: 'white',
                textAlign: 'center',
                padding: 0,
              }}>
              {myInfo.Distancia / 1000} KM / 10 KM
            </Text>
            <ProgressBar
              width={150}
              style={{marginTop: 5}}
              progress={myInfo.Distancia > 10000 ? 1 : myInfo.Distancia / 10000}
              color={openColor}
            />

            <Text
              style={{
                ...estilos.titulo,
                fontSize: 15,
                color: 'white',
                marginTop: 8,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Posicion {myInfo.position + 1} / {students.length}
            </Text>
          </View>
        </View>
        <View style={{width: '80%'}}>
          <TouchableOpacity
            onPress={closeSession}
            style={{
              ...estilos.buttonHigh,
              backgroundColor: openColor,
              display: 'flex',
              flexDirection: 'row-reverse',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              iconStyle={{fontSize: 20}}
              name="log-out"
              type="feather"
              color="white"
            />
            <Text
              style={{marginRight: 15, textAlign: 'center', color: 'white'}}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <MenuDrawer
      open={showingDrawer}
      drawerContent={drawerContent()}
      drawerPercentage={70}
      animationTime={250}
      overlay={true}
      opacity={0.4}>
      <View
        style={{...estilos.mainContainer, position: 'relative', zIndex: -3}}>
        {myInfo.position === 0 && <Fireworks bg={true} />}
        <ImageBackground
          source={background_image}
          style={estilos.backgroundImage}
        />
        <View
          style={{position: 'absolute', alignItems: 'center', top: 0, left: 0}}>
          <View
            style={{
              ...estilos.mainContainer,
              flexDirection: 'row',
              width: screenWidth,
              justifyContent: 'space-around',
              alignItems: 'center',
              height: 120,
              opacity: 1,
            }}>
            <Icon
              iconStyle={{fontSize: 40, marginTop: 20}}
              name="menu"
              type="feather"
              color="white"
              onPress={() => setShowingDrawer(true)}
            />
            <Image source={cucei_horizontal} style={{width: 120, height: 80}} />
          </View>
          <Text style={{...estilos.titulo, letterSpacing: 10}}>RANKING</Text>
          <FlatList
            style={{
              width: '90%',
              height:
                myInfo.position > 2 ? screenHeight * 0.4 : screenHeight * 0.5,
            }}
            scrollEnabled
            data={topThree}
            keyExtractor={item => `${item.Codigo}-${item.id}`}
            renderItem={({item, index}) => {
              return (
                <RankingCard
                  alumno={item}
                  place={item.position ? item.position + 1 : index + 1}
                />
              );
            }}
          />
          {myInfo.position && myInfo.position > 2 ? (
            <View style={{width: '85%', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
              <RankingCard alumno={myInfo} place={myInfo.position + 1} />
            </View>
          ) : null}
          {myInfo.Distancia >= 10000 ? (
            <View>
              <Text
                style={{
                  ...estilos.titulo,
                }}>
                ¡FELICIDADES!
              </Text>
              <Text
                style={{
                  ...estilos.subtitulo,
                  color: 'white',
                  letterSpacing: 4,
                }}>
                ¡Haz alcanzado la meta!
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Try')}
              style={{...estilos.buttonHigh, backgroundColor: 'white'}}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 16,
                  letterSpacing: 5,
                }}>
                AÑADIR INTENTO
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </MenuDrawer>
  );
};

export default Home;
