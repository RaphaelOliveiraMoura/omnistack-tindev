const Dev = require('../models/Dev');

async function store(request, response) {
  const { id } = request.params;
  const { user } = request.headers;

  const loggedDev = await Dev.findById(user).catch(error => {
    return response.status(400).json({ error: 'Invalid login id' });
  });

  const targetDev = await Dev.findById(id).catch(error => {
    return response.status(400).json({ error: 'Invalid dev id' });
  });

  if (!loggedDev) {
    return response.status(400).json({ error: 'Error with login' });
  }

  if (!targetDev) {
    return response.status(400).json({ error: 'Dev does not exists' });
  }

  loggedDev.likes.push(targetDev);

  await loggedDev.save();

  return response.status(200).json(loggedDev);
}

module.exports = {
  store
};
