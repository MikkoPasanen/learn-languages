const pool = require('./dbConfig');

module.exports = {
  // Finds all results from selected table
  fetchAll: (lang) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM ??';

      pool.query(sql, [lang], (err, results) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          resolve(results);
        }
      });
    });
  },
  addData: (lang, { category, foreingWord, finnishWord }) => {
    return new Promise((resolve, reject) => {
      const sql =
        'INSERT INTO ??(category, foreing_word, finnish_word) VALUES(?, ?, ?)';

      pool.query(
        sql,
        [lang, category, foreingWord, finnishWord],
        (err, results) => {
          if (err) {
            reject({ status: 500, msg: err });
          } else {
            resolve(results);
          }
        },
      );
    });
  },
};
