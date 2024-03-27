import app from './app.js';

const port = 9285;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
