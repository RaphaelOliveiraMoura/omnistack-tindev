async function store(request, response) {
  const { id } = request.params;
  const { user } = request.headers;

  return response.status(200).json({ id });
}

module.exports = {
  store
};
