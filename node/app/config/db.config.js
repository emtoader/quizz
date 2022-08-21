import { Sequelize } from "sequelize";
 

// const db = new Sequelize('toptal_quizz', 'root', '', {
//     host: "localhost",
//     dialect: "mysql",
// });

const db = new Sequelize('quizz', 'root', '', {
    host: "mysqldb",
    dialect: "mysql",
});
 
export default db;