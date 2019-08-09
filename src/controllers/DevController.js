const Dev = require('../models/Dev');
const github = require('../services/github');

async function store(request, response) {
  const { username } = request.body;

  const userExists = await Dev.findOne({ user: username });
  if (userExists) {
    return response.status(200).json(userExists);
  }

  const { data: userData } = await github.getUserFromGitHub(username);
  const { name, bio, avatar_url: avatar } = userData;

  const dev = await Dev.create({
    name,
    user: username,
    bio,
    avatar
  });

  return response.status(201).json(dev);
}

async function index(request, response) {
  const { user: loggedDevId } = request.headers;
  const loggedDev = await Dev.findById(loggedDevId);

  const users = await Dev.find({
    $and: [
      { _id: { $ne: loggedDevId } },
      { _id: { $nin: loggedDev.likes } },
      { _id: { $nin: loggedDev.dislikes } }
    ]
  });

  return response.status(200).json(users);
}

module.exports = {
  index,
  store
};
