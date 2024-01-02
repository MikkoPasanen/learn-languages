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

  // Find user by username
  findUser: (username) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';

      pool.query(sql, [username], (err, results) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          resolve(results);
        }
      });
    });
  },

  // Adds new user
  addUser: (username, password) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';

      pool.query(sql, [username, password], (err, results) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          resolve(results);
        }
      });
    });
  },

  addExercise: (exerciseName, category, language) => {
    return new Promise((resolve, reject) => {
      const sql =
        'INSERT INTO exercises (name, category, language) VALUES (?, ?, ?)';

      pool.query(sql, [exerciseName, category, language], (err, results) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          resolve(results.insertId);
        }
      });
    });
  },

  addWordPairs: (exerciseId, wordPairs) => {
    return new Promise((resolve, reject) => {
      const sql =
        'INSERT INTO wordpairs (foreign_word, finnish_word, exercise_id) VALUES ?';

      const values = wordPairs.map((pair) => {
        return [pair.english, pair.foreign, exerciseId];
      });

      pool.query(sql, [values], (err, results) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          resolve(results);
        }
      });
    });
  },

  deleteExercise: (id) => {
    return new Promise((resolve, reject) => {
      const sqlExercise = 'DELETE FROM exercises WHERE id = ?';
      const sqlWordPairs = 'DELETE FROM wordpairs WHERE exercise_id = ?';

      pool.query(sqlWordPairs, [id], (err) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          pool.query(sqlExercise, [id], (err) => {
            if (err) {
              reject({ status: 500, msg: err });
            } else {
              resolve();
            }
          });
        }
      });
    });
  },
};
