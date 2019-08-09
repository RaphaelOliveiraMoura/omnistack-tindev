const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.github.com'
});

async function getUserFromGitHub(username) {
  return await api.get(`/users/${username}`);
}

module.exports = {
  getUserFromGitHub
};
