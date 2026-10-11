
require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const caPath = process.env.DB_SSL_CA;
const caCert = process.env.DB_SSL_CA_CERT
    ? process.env.DB_SSL_CA_CERT.replace(/\\n/g, "\n")
    : caPath
        ? fs.readFileSync(path.resolve(caPath), "utf8")
        : undefined;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,

    ssl: caCert
        ? {
            ca: caCert,
            rejectUnauthorized: true
        }
        : undefined,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;
