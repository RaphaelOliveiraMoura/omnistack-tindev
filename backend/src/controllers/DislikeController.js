const Dev = require('../models/Dev');

async function store(request, response) {
  const { id: targetDevId } = request.params;
  const { user: loggedDevId } = request.headers;

  const loggedDev = await Dev.findById(loggedDevId).catch(error => {
    return response.status(400).json({ error: 'Invalid login id' });
  });

  const targetDev = await Dev.findById(targetDevId).catch(error => {
    return response.status(400).json({ error: 'Invalid dev id' });
  });

  if (!loggedDev) {
    return response.status(400).json({ error: 'Error with login' });
  }

  if (!targetDev) {
    return response.status(400).json({ error: 'Dev does not exists' });
  }

  if (loggedDev.dislikes.includes(targetDevId)) {
    return response
      .status(200)
      .json({ message: 'You already gave dislikes to this user' });
  }

  if (loggedDev.likes.includes(targetDevId)) {
    const index = loggedDev.likes.indexOf(targetDevId);
    loggedDev.likes.splice(index, 1);
  }

  loggedDev.dislikes.push(targetDevId);
  await loggedDev.save();

  return response.status(201).json(loggedDev);
}

module.exports = {
  store
};
