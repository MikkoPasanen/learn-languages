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
          console.log(err);
          reject({ status: 500, msg: err });
        } else {
          resolve(results.insertId);
        }
      });
    });
  },
};
