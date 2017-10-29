"use strict";
let config = {
    PORT: 3000,
    DB_URL: "mongodb://admin:admin@ds237445.mlab.com:37445/knwd-hack",
    SESSION_SECRET: "session_secret",
    JWT_SECRET: "jwt_secret",
    EMAIL_USERNAME: "system@instudy.pl",
    EMAIL_PASSWORD: "22uP*eB*JX",
    EMAIL_HOST: "mail13.mydevil.net",
    DOMEIN: "http://localhost:3000",
    FILE_SIZE: 512*1024,
    TOKEN_LIFE: 3600,
    STATIC_MAX_AGE: 7*24*3600*1000,
    TEST_MODE: true
};

module.exports = config;