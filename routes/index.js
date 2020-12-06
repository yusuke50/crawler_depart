import express, { response } from 'express';
import request from 'request';
import cheerio from 'cheerio';
import { rejects } from 'assert';
import { resolve } from 'path';

let router = express.Router();
const path = require('path');
const rootDir = path.resolve('./');


router.get('/', (req, res, next) => {
  res.sendFile(rootDir + '/index.html');
});

router.get('/index.html', (req, res, next) => {
  res.sendFile(rootDir + '/index.html');
});

router.get('/getList', (req, res, next) => {
  // const mapArea = [100, 103, 104, 105, 106, 108, 109, 110, 111, 112, 114, 115, 116];
  const mapArea = [100, 103];
  Promise.resolve('start getting page')
    .then((res) => {
      console.log(res);
    }).then(() => {
      const promisePage = [];
      
      mapArea.forEach((a) => {
        promisePage.push(
          new Promise((resolve, reject) => {
            request(`http://qservice.dba.tcg.gov.tw/depart/vdepart_list.asp?basare=${a}`, (err, response, body) => {
              if (err) {
                reject(err);
              } else if (response.statusCode === 404) {
                reject('404 error');
              } else {
                const $ = cheerio.load(body);
                const tar = $('body tbody tbody tbody tbody tbody a[name="lastpage"]');
                const re = /(\d+)/;
                resolve(re.exec(tar.attr('href'))[0]);
              }
            });
          })
        )
      });

      return Promise.all(promisePage);
    })
    .then((resP) => {
      const promisePage = [];

      for (let i = 0; i < mapArea.length; i += 1) {
        const listResult = [];

        promisePage.push(
          new Promise((resolve, reject) => {
            for (let j = 1; j <= parseInt(resP[i], 10); j += 1) {
              request(`http://qservice.dba.tcg.gov.tw/depart/vdepart_list.asp?basare=${mapArea[i]}&rspage=${j}`, (err, response, body) => {
                if (err) {
                  reject(err);
                } else if (response.statusCode === 404) {
                  reject('404 error');
                } else {
                  const $ = cheerio.load(body);
                  for (let k = 4; k <= 12; k += 1) {
                    const o = {
                      date: '',
                      name: '',
                      area: '',
                      address: '',
                      no: '',
                      approve: '',
                      note: '',
                    };
                    o.date = $(`body tbody tbody tbody tbody tbody tr:nth-child(${k}) td:nth-child(1)`).html();
                    o.name = $(`body tbody tbody tbody tbody tbody tr:nth-child(${k}) td:nth-child(2)`).text();
                    o.area = $(`body tbody tbody tbody tbody tbody tr:nth-child(${k}) td:nth-child(3)`).text();
                    o.address = $(`body tbody tbody tbody tbody tbody tr:nth-child(${k}) td:nth-child(4)`).text();
                    o.no = $(`body tbody tbody tbody tbody tbody tr:nth-child(${k}) td:nth-child(5)`).text();
                    o.approve = $(`body tbody tbody tbody tbody tbody tr:nth-child(${k}) td:nth-child(6)`).text();
                    o.note = $(`body tbody tbody tbody tbody tbody tr:nth-child(${k}) td:nth-child(7)`).text();

                    console.log(o);
                    listResult.push(o);
                  }
                  resolve(listResult);
                }
              });
            }
          })
        )
      }

      return Promise.all(promisePage);
    })
    .then((resT) => {
      console.log(resT);
      res.send(resT);
    })
    .catch((err) => {
      console.error(err);
    });
});

export default router;