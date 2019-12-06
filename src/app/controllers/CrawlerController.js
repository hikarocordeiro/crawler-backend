/* eslint-disable func-names */
import Crawler from 'simplecrawler';
import cheerio from 'cheerio';

class CrawlerController {
  index(req, res) {
    const { url } = req.params;

    const sitemap = [];
    const crawler = new Crawler(url);

    crawler.maxConcurrency = 3;
    crawler.stripQuerystring = true;
    crawler.maxDepth = 3;

    crawler.start();

    // eslint-disable-next-line no-unused-vars
    crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
      if (
        !queueItem.path
          .split('.')
          .pop()
          .match(/(png|jpg|jpeg|gif|ico|css|js|csv|doc|docx|pdf|xml)$/i)
      ) {
        const item = {};

        const html = responseBuffer.toString();
        const $ = cheerio.load(html);

        const cssHrefs = $('link')
          .map(function() {
            return $(this).attr('rel') === 'stylesheet'
              ? $(this).attr('href')
              : null;
          })
          .get();
        const scriptSrcs = $('script')
          .map(function() {
            return $(this).attr('src');
          })
          .get();
        const imgSrcs = $('img')
          .map(function() {
            return $(this).attr('src');
          })
          .get();

        item.page = queueItem.url;
        item.css = cssHrefs;
        item.js = scriptSrcs;
        item.img = imgSrcs;

        sitemap.push(item);
      }
    });

    crawler.on('complete', function() {
      return res.json(sitemap);
    });
  }
}

export default new CrawlerController();
