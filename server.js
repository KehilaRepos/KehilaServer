import app from './app.js';
import { postgres_boot } from './utils.js';
const port = 9285;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  postgres_boot();
});
