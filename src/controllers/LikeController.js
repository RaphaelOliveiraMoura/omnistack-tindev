const Dev = require('../models/Dev');

async function store(request, response) {
  const { id: targetDevId } = request.params;
  const { user: loggedDevId } = request.headers;

  try {
    const loggedDev = await getUserById(loggedDevId);
    const targetDev = await getUserById(targetDevId);

    verifyIfUserAlrealdyGaveLike(loggedDev, targetDev);
    verifyIfIsAMatch(request, loggedDev, targetDev);

    loggedDev.likes.push(targetDevId);
    await loggedDev.save();
    return response.status(201).json(loggedDev);
  } catch (error) {
    return response
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
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

function verifyIfUserAlrealdyGaveLike(loggedUser, targetUser) {
  if (loggedUser.likes.includes(targetUser._id)) {
    throw { status: 200, message: 'You already gave like to this user' };
  }

  if (loggedUser.dislikes.includes(targetUser._id)) {
    const index = loggedUser.dislikes.indexOf(targetUser._id);
    loggedUser.dislikes.splice(index, 1);
  }
}

function verifyIfIsAMatch(request, loggedUser, targetUser) {
  if (targetUser.likes.includes(loggedUser._id)) {
    const loggedSocket = request.connectedUsers[loggedUser._id];
    const targetSocket = request.connectedUsers[targetUser._id];

    if (loggedSocket) {
      request.io.to(loggedSocket).emit('match', targetUser);
    }
    if (targetSocket) {
      request.io.to(targetSocket).emit('match', loggedUser);
    }
  }
}

module.exports = {
  store
};
