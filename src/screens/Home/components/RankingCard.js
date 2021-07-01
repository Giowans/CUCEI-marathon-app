import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import ParticlesBg from 'react-native-particles-bg';

const RankingCard = ({alumno, place}) => {
  const {Codigo, Nombre, imagen, Tiempo, Distancia} = alumno;

  const getColorsByPlace = rankingPlace => {
    switch (rankingPlace) {
      case 1:
        return ['#D4AF37', '#C5A028', '#B69119', '#E3BE46'];
      case 2:
        return ['#C0C0C0', '#B1B1B1', '#A2A2A2', '#CFCFCF'];
      case 3:
        return ['#CD7F32', '#BE7023', '#AF6114', '#DC8E41'];
      default:
        return ['white', 'white'];
    }
  };

  //Particles configuration
  let config = {
    body: "transparent",
    num: [1, 3],
    rps: 0.1,
    radius: [5, 40],
    life: [1.5, 3],
    v: [2, 3],
    tha: [-40, 40],
    rotate: [0, 20],
    alpha: [0.6, 0],
    scale: [1, 0.5],
    position: {x: 1, y: 1, width: 50, height: 50},
    color: getColorsByPlace(place),
    cross: 'dead', // cross or bround
    random: 3, // or null,
    g: 5, // gravity
    // f: [2, -1], // force
    onParticleUpdate: (ctx, particle) => {
      ctx.beginPath();
      ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();
  }
  };

  const styles = StyleSheet.create({
    mainContainer: {
      width: '100%',
      height: 100,
      marginVertical: 10,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
      borderColor: getColorsByPlace(place)[1],
      borderBottomWidth: 2,
    },
    avatar: {
      borderRadius: 10,
    },
    rankingCard: {
      display: 'flex',
      paddingHorizontal: 25,
      width: '45%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <TouchableOpacity style={styles.mainContainer}>
      {/*Number(place) < 4 && (
        <ParticlesBg key = {`${place} - ${Codigo}`} num = {10} type="fireworks" color = {getColorsByPlace(place)[0]} bg={true} />
      )*/}
      <View style={styles.rankingCard}>
        <Text style={{color: getColorsByPlace(place)[1], fontSize: 40}}>
          {`${place}-.`}
        </Text>
        <View
          style={{
            width: '100%',
            marginLeft: 5,
            height: '100%',
            ...styles.avatar,
          }}>
          <Image
            style={{width: 80, height: 80, ...styles.avatar}}
            source={{uri: imagen}}
          />
        </View>
      </View>
      <View
        style={{
          width: '55%',
          padding: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: getColorsByPlace(place)[1],
          }}>
          {Nombre}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '500',
            color: getColorsByPlace(place)[1],
          }}>
          {Codigo}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '400',
            color: getColorsByPlace(place)[1],
          }}>
          Distancia: {Distancia / 1000} KM
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '400',
            color: getColorsByPlace(place)[1],
          }}>
          Tiempo: {Math.floor(Tiempo / 60)} {Math.floor(Tiempo / 60) !== 1 ? 'horas' : 'hora'} {Tiempo % 60 > 0 ? ` con ${Tiempo % 60} minutos` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RankingCard;
