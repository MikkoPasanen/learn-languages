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

  addExercise: (
    exerciseName,
    category,
    language,
    wordPairs,
    madeBy,
    modified,
  ) => {
    return new Promise((resolve, reject) => {
      const sqlExercise =
        'INSERT INTO exercises (name, category, language, made_by, modified) VALUES (?, ?, ?, ?, ?)';
      const sqlWordPairs =
        'INSERT INTO wordpairs (english_word, foreign_word, exercise_id) VALUES ?';

      pool.query(
        sqlExercise,
        [exerciseName, category, language, madeBy, modified],
        (err, results) => {
          if (err) {
            reject({ status: 500, msg: err });
          } else {
            const exerciseId = results.insertId;

            const values = wordPairs.map((pair) => {
              return [pair.english, pair.foreign, exerciseId];
            });

            pool.query(sqlWordPairs, [values], (err) => {
              if (err) {
                reject({ status: 500, msg: err });
              } else {
                resolve(results);
              }
            });
          }
        },
      );
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

  editExercise: (id, exerciseName, category, language, wordPairs) => {
    return new Promise((resolve, reject) => {
      const sqlExercise =
        'UPDATE exercises SET name = ?, category = ?, language = ? WHERE id = ?';
      const sqlWordPairs =
        'UPDATE wordpairs SET english_word = ?, foreign_word = ? WHERE id = ?';

      pool.query(
        sqlExercise,
        [exerciseName, category, language, id],
        (err, results) => {
          if (err) {
            console.log(err);
            reject({ status: 500, msg: err });
          } else {
            for (const pair of wordPairs) {
              pool.query(
                sqlWordPairs,
                [pair.english, pair.foreign, pair.id],
                (err) => {
                  if (err) {
                    reject({ status: 500, msg: err });
                  }
                },
              );
            }
            resolve(results);
          }
        },
      );
    });
  },

  addWordPairs: (exerciseId, wordPairs) => {
    return new Promise((resolve, reject) => {
      const sql =
        'INSERT INTO wordpairs (english_word, foreign_word, exercise_id) VALUES ?';

      const values = wordPairs.map((pair) => {
        return [pair.english, pair.foreign, exerciseId];
      });

      console.log(values);

      pool.query(sql, [values], (err) => {
        if (err) {
          reject({ status: 500, msg: err });
        } else {
          resolve();
        }
      });
    });
  },

  deleteWordPairs: (wordPairIds) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM wordpairs WHERE id = ?';

      for (const id of wordPairIds) {
        pool.query(sql, [id], (err) => {
          if (err) {
            reject({ status: 500, msg: err });
          }
        });
      }
      resolve();
    });
  },
};
