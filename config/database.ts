import { Sequelize } from "sequelize";

const db = new Sequelize('belajar-mern', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db;