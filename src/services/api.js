import axios from 'axios';
const api = axios.create({
  baseURL: 'http://10.0.3.2:5050/api'
});

export async function signIn(username) {
  return await api.post('/devs', {
    username
  });
}

export async function listDevs(loggedUserId) {
  return await api.get('/devs', {
    headers: {
      user: loggedUserId
    }
  });
}

export async function like(loggedUserId, targetUser) {
  return await api.post(
    `/devs/${targetUser}/likes`,
    {},
    {
      headers: {
        user: loggedUserId
      }
    }
  );
}

export async function dislike(loggedUserId, targetUser) {
  return await api.post(
    `/devs/${targetUser}/dislikes`,
    {},
    {
      headers: {
        user: loggedUserId
      }
    }
  );
}

export default {
  signIn,
  listDevs,
  like,
  dislike
};
