import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import User from "./user.model.js";
 
const { DataTypes } = Sequelize;
 
const Quizz = db.define('quizzes',{
    name:{
        type: DataTypes.STRING
    },
    slug:{
        type: DataTypes.STRING
    },
    published:{
      type: DataTypes.BOOLEAN
     }
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();

export default Quizz;

Quizz.belongsTo(User) 

