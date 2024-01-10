/**
 * @fileoverview Methods for fetching data from database.
 * @module database/methods
 */

// Load database configuration
const pool = require('./dbConfig');

module.exports = {
  /**
   * @description Fetches all exercises from database.
   * @returns {Promise} A promise that resolves with the exercises data if found, or rejects with an error.
   */
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

  /**
   * Finds all results from a selected exercise.
   * @param {number} id - The ID of the exercise to fetch.
   * @returns {Promise} A promise that resolves with the exercise data if found, or rejects with an error.
   */
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

  /**
   * Find a user by their username.
   * @param {string} username - The username of the user to find.
   * @returns {Promise} A promise that resolves with the user's data if found, or rejects with an error.
   */
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

  /**
   * Adds a new user to the database.
   * @param {string} username - The username of the new user.
   * @param {string} password - The password of the new user.
   * @returns {Promise} A promise that resolves with the result of the insert operation, or rejects with an error.
   */
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

  /**
   * Adds a new exercise to the database.
   * @param {string} exerciseName - The name of the new exercise.
   * @param {string} category - The category of the new exercise.
   * @param {string} language - The language of the new exercise.
   * @param {Array} wordPairs - The word pairs of the new exercise.
   * @param {string} madeBy - The creator of the new exercise.
   * @param {Date} modified - The date the new exercise was last modified.
   * @returns {Promise} A promise that resolves with the result of the insert operation, or rejects with an error.
   */
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

  /**
   * Deletes an exercise from the database.
   * @param {number} id - The ID of the exercise to delete.
   * @returns {Promise} A promise that resolves when the delete operation is complete, or rejects with an error.
   */
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

  /**
   * Edits an existing exercise in the database.
   * @param {number} id - The ID of the exercise to edit.
   * @param {string} exerciseName - The new name of the exercise.
   * @param {string} category - The new category of the exercise.
   * @param {string} language - The new language of the exercise.
   * @param {Array} wordPairs - The new word pairs of the exercise.
   * @param {Date} modified - The new last modified date of the exercise.
   * @returns {Promise} A promise that resolves when the update operation is complete, or rejects with an error.
   */
  editExercise: (id, exerciseName, category, language, wordPairs, modified) => {
    return new Promise((resolve, reject) => {
      const sqlExercise =
        'UPDATE exercises SET name = ?, category = ?, language = ?, modified = ? WHERE id = ?';
      const sqlWordPairs =
        'UPDATE wordpairs SET english_word = ?, foreign_word = ? WHERE id = ?';

      pool.query(
        sqlExercise,
        [exerciseName, category, language, modified, id],
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

  /**
   * Adds word pairs to an existing exercise in the database.
   * @param {number} exerciseId - The ID of the exercise to add word pairs to.
   * @param {Array} wordPairs - The word pairs to add to the exercise.
   * @returns {Promise} A promise that resolves when the insert operation is complete, or rejects with an error.
   */
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

  /**
   * Deletes word pairs from the database.
   * @param {Array} wordPairIds - The IDs of the word pairs to delete.
   * @returns {Promise} A promise that resolves when the delete operation is complete, or rejects with an error.
   */
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
