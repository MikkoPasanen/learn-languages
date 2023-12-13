const pool = require('./dbConfig');

module.exports = {
  fetchAll: (lang) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM ?';

      pool.query(sql, [lang], (err, results) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          resolve(results);
        }
      });
    });
  },
};
