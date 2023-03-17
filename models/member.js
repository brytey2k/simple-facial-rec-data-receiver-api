const sequelize = require("../utils/db");
const Sequelize = require("sequelize");

const Member = sequelize.define('member', {
    id: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    face: Sequelize.STRING,
    face_feature: Sequelize.TEXT
});

module.exports = Member;