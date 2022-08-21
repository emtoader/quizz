import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import Quizz from "./quizz.model.js";
 
const { DataTypes } = Sequelize;

const QuizzQuestion = db.define('quizz_question',{
    question:{
        type: DataTypes.STRING
    },
    type:{
        type: DataTypes.STRING
    },
    order:{
        type: DataTypes.TINYINT
    },
  },{
    freezeTableName:true
  });

(async () => {
    await db.sync();
})();

  
  export default QuizzQuestion;

  QuizzQuestion.belongsTo(Quizz)  
  Quizz.hasMany(QuizzQuestion)