import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import getItemHandler from './routes/items/get';
import searchItemsHandler from './routes/items/search';
import handler from './handler';

class Server {
  constructor() {
    this.app = express();
    /* eslint-disable no-undef */
    this.port = process.env.PORT || 3000;
  }

  configure() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.set('json spaces', 40);
    this.app.use(cors());
  }

  loadRoutes() {
    this.app.get('/api/items/:id', handler(getItemHandler));
    this.app.get('/api/items', handler(searchItemsHandler));
    this.app.get('/echo', function (req, res) {
      res.send('API online');
    });
  }

  listen() {
    /* eslint-disable no-console */
    this.app.listen(this.port, () => console.log(`Server listening on port ${this.port}!`));
  }
}

export default Server;