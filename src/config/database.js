import pkg from 'pg'
import { config } from "./env.js"

const { Pool } = pkg;

const pool = new Pool({
    max: 100,
    host: config.db.host,
    user: config.db.user,
    database: config.db.name,
    password: config.db.password,
    port: config.db.port
});


export const executeQuery = (query, values = []) => {

    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) {
                console.error("Error creating database connection", err);
                return reject(err);
            }

            client.query(query, values, (err, results) => {
                done();
                if (err) {
                    console.error("Error executing query", err);
                    return reject(err);
                }
                return resolve(results.rows);
            })
        })
    })
}