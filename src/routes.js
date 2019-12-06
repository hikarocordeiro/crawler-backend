import { Router } from 'express';

import CrawlerController from './app/controllers/CrawlerController';

const routes = new Router();

routes.get('/crawler/:url', CrawlerController.index);

export default routes;
