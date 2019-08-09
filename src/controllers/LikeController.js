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

  if (loggedDev.likes.includes(targetDevId)) {
    return response
      .status(200)
      .json({ message: 'You already gave like to this user' });
  }

  if (loggedDev.dislikes.includes(targetDevId)) {
    const index = loggedDev.dislikes.indexOf(targetDevId);
    loggedDev.dislikes.splice(index, 1);
  }

  if (targetDev.likes.includes(loggedDevId)) {
    console.log('>>> Deu Match');
  }

  loggedDev.likes.push(targetDevId);
  await loggedDev.save();

  return response.status(201).json(loggedDev);
}

module.exports = {
  store
};
