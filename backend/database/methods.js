const pool = require('./dbConfig');

module.exports = {
  // Fetches all exercises
  fetchAllExercises: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM exercises';

      pool.query(sql, (err, results) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          resolve(results);
        }
      });
    });
  },
  // Finds all results from selected exercise
  fetchExercise: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM wordpairs WHERE exercise_id = ?';

      pool.query(sql, [id], (err, results) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          resolve(results);
        }
      });
    });
  },
};
