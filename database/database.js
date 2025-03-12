// // const sqlite3 = require('sqlite3').verbose();
// // const path = require('path');

// // const dbPath = path.join(__dirname, 'ukn_diamond_job_search_app_api_live.db');

// // const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
// //   if (err) {
// //     console.error('❌ Database connection failed:', err.message);
// //   } else {
// //     console.log('✅ Connected to SQLite database');
// //     initializeTables();
// //   }
// // });

// // // Function to create tables if they don't exist
// // const initializeTables = () => {
// //   db.run(`
// //     CREATE TABLE IF NOT EXISTS users (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       user_full_name TEXT NOT NULL,
// //       user_name TEXT NOT NULL,
// //       mobile_no TEXT NOT NULL UNIQUE,
// //       email_id TEXT NOT NULL UNIQUE,
// //       password TEXT NOT NULL,
// //       device_id TEXT,
// //       dob INTEGER,
// //       gender BOOLEAN,
// //       about_as TEXT,
// //       profile_image TEXT,
// //       address TEXT,
// //       business_type TEXT,
// //       is_employ BOOLEAN DEFAULT TRUE,
// //       status BOOLEAN DEFAULT TRUE,
// //       work_fields TEXT, -- Stored as JSON string
// //       department_id INTEGER,
// //       department_name TEXT,
// //       company_name TEXT,
// //       company_mobile_no TEXT,
// //       company_email_id TEXT,
// //       company_about_as TEXT,
// //       company_address TEXT
// //     );
// //   `);

// //   db.run(`
// //     CREATE TABLE IF NOT EXISTS job_department_data (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       name TEXT NOT NULL,
// //       fields TEXT NOT NULL, -- Stored as JSON string
// //       status BOOLEAN NOT NULL DEFAULT TRUE
// //     );
// //   `);
// // };

// // // Function to run SQL queries
// // const runQuery = (query, params = []) => {
// //   return new Promise((resolve, reject) => {
// //     db.all(query, params, (err, result) => {
// //       if (err) {
// //         reject(err);
// //       } else {
// //         resolve(result);
// //       }
// //     });
// //   });
// // };

// // module.exports = { db, runQuery };


// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');

// const dbPaths = {
//     'dev': path.join(__dirname, 'ukn_diamond_job_search_app_api_dev.db'),
//     'live': path.join(__dirname, 'ukn_diamond_job_search_app_api_live.db')
// };

// const createDatabaseConnection = (apiType) => {
//     const dbPath = dbPaths[apiType] || dbPaths['live'];

//     const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
//         if (err) {
//             console.error(`❌ Database connection failed for ${apiType}:`, err.message);
//         } else {
//             console.log(`✅ Connected to SQLite database for ${apiType}`);
//             initializeTables(db);
//         }
//     });

//     return db;
// };

// const initializeTables = (db) => {
//     db.run(`
//         CREATE TABLE IF NOT EXISTS users (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           user_full_name TEXT NOT NULL,
//           user_name TEXT NOT NULL,
//           mobile_no TEXT NOT NULL UNIQUE,
//           email_id TEXT NOT NULL UNIQUE,
//           password TEXT NOT NULL,
//           device_id TEXT,
//           dob INTEGER,
//           gender BOOLEAN,
//           about_as TEXT,
//           profile_image TEXT,
//           address TEXT,
//           business_type TEXT,
//           is_employ BOOLEAN DEFAULT TRUE,
//           status BOOLEAN DEFAULT TRUE,
//           work_fields TEXT, -- Stored as JSON string
//           department_id INTEGER,
//           department_name TEXT,
//           company_name TEXT,
//           company_mobile_no TEXT,
//           company_email_id TEXT,
//           company_about_as TEXT,
//           company_address TEXT
//         );
//       `);

//     db.run(`
//         CREATE TABLE IF NOT EXISTS job_department_data (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           name TEXT NOT NULL,
//           fields TEXT NOT NULL, -- Stored as JSON string
//           status BOOLEAN NOT NULL DEFAULT TRUE
//         );
//       `);
// };

// const runQuery = (db, query, params = []) => {
//     return new Promise((resolve, reject) => {
//         db.all(query, params, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// };


// module.exports = { createDatabaseConnection, runQuery };

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPaths = {
    'dev': path.join(__dirname, 'ukn_diamond_job_search_app_api_dev.db'),
    'live': path.join(__dirname, 'ukn_diamond_job_search_app_api_live.db')
};

const createDatabaseConnection = (apiType) => {
    const dbPath = dbPaths[apiType] || dbPaths['live'];

    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(`❌ Database connection failed for ${apiType}:`, err.message);
        } else {
            console.log(`✅ Connected to SQLite database for ${apiType}`);
            initializeTables(db);
        }
    });

    return db;
};

const initializeTables = (db) => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_full_name TEXT NOT NULL,
            user_name TEXT NOT NULL,
            mobile_no TEXT NOT NULL UNIQUE,
            email_id TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            device_id TEXT,
            dob INTEGER,
            gender BOOLEAN,
            about_as TEXT,
            profile_image TEXT,
            address TEXT,
            business_type TEXT,
            is_employ BOOLEAN DEFAULT TRUE,
            status BOOLEAN DEFAULT TRUE,
            work_fields TEXT, -- Stored as JSON string
            job_department_id INTEGER,
            company_name TEXT,
            company_mobile_no TEXT,
            company_email_id TEXT,
            company_about_as TEXT,
            company_address TEXT,
            FOREIGN KEY (job_department_id) REFERENCES job_department_data(id)
        );`);

        db.run(`CREATE TABLE IF NOT EXISTS job_department_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            department_name TEXT NOT NULL,
            fields TEXT NOT NULL, -- Stored as JSON string
            status BOOLEAN NOT NULL DEFAULT TRUE
        );`);
    });
};

const runQuery = (db, query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = { createDatabaseConnection, runQuery };
