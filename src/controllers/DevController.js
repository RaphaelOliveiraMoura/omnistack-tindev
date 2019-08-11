const Dev = require('../models/Dev');
const github = require('../services/github');

async function store(request, response) {
  const { username } = request.body;
  try {
    const userExists = await getOneUser({ user: username });
    if (userExists) return response.status(200).json(userExists);
    const githubUser = await getUserFromGitHub(username);
    const dev = await createUser(githubUser);
    return response.status(201).json(dev);
  } catch (error) {
    return response
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
}

async function index(request, response) {
  const { user: loggedDevId } = request.headers;
  try {
    const loggedDev = await getUserById(loggedDevId);
    const users = await getUser({
      $and: [
        { _id: { $ne: loggedDevId } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ]
    });
    return response.status(200).json(users);
  } catch (error) {
    return response
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
}

async function getOneUser(userProps) {
  try {
    return await Dev.findOne(userProps);
  } catch (error) {
    throw { status: 500, message: 'Error querrying user in the database' };
  }
}

async function getUserFromGitHub(username) {
  try {
    const { data } = await github.getUserFromGitHub(username);
    const userExists = !!data;
    if (!userExists) throw { status: 400, message: 'User dont exists' };
    const { name, login, bio, avatar_url: avatar } = data;
    return {
      name: name || login,
      user: username,
      bio,
      avatar
    };
  } catch (error) {
    throw { status: 500, message: 'Error getting user from github' };
  }
}

async function createUser(user) {
  try {
    return await Dev.create(user);
  } catch (error) {
    throw { status: 500, message: 'Error saving user in database' };
  }
}

async function getUser(querry) {
  try {
    return await Dev.find(querry);
  } catch (error) {
    throw { status: 500, message: 'Error getting user in database' };
  }
}

async function getUserById(userId) {
  try {
    const user = await Dev.findById(userId);
    if (!user) throw { status: 400, message: 'User dont exists' };
    return user;
  } catch (error) {
    throw { status: 500, message: 'Error getting user in database' };
  }
}

module.exports = {
  index,
  store
};
