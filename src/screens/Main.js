import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

export default function Main({ navigation }) {
  const id = navigation.getParam('user');
  const [users, setUsers] = useState([]);

  async function handleLike() {
    const [targetUser, ...rest] = users;
    await api.like(id, targetUser._id);
    setUsers(rest);
  }

  async function handleDislike() {
    const [targetUser, ...rest] = users;
    await api.dislike(id, targetUser._id);
    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  useEffect(() => {
    api.listDevs(id).then(response => {
      setUsers(response.data);
    });
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>
      <View style={styles.cardsContainer}>
        {users.length === 0 ? (
          <Text style={styles.empty}>Acabou :(</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, { zIndex: users.length - index }]}
            >
              <Image
                style={styles.avatar}
                source={{
                  uri: user.avatar
                }}
              />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
      {users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislike} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 30
  },

  logo: {
    marginTop: 16
  },

  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500
  },

  card: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  avatar: {
    flex: 1,
    height: 300
  },

  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },

  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30
  },

  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold'
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
});
