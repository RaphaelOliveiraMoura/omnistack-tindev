const app = require('./src/app');

const serverPort = 5050;

app.listen(serverPort, () => {
  console.log(`> application running on port ${serverPort}`);
});
