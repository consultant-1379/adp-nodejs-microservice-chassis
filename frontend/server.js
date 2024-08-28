/* eslint-disable-next-line */
import * as url from 'url';
import express from 'express';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
app.disable('x-powered-by');

const port = process.env.port || 3010;

app.use(express.static('build'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
});

app.listen(port, () => {
  /* eslint-disable-next-line */
  console.log(
    `MF Service - "E-UI SDK Skeleton" is running on port http://localhost:${port}`,
  );
});
