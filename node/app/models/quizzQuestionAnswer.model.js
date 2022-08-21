import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import QuizzQuestion from "./quizzQuestion.model.js";
 
const { DataTypes } = Sequelize;

const QuizzQuestionAnswer = db.define('quizz_question_answer',{
    answer:{
        type: DataTypes.STRING
    },
    order:{
        type: DataTypes.TINYINT
    },
    isCorrect:{
      type: DataTypes.BOOLEAN
    },
  },{
    freezeTableName:true 
  }); 

(async () => {
    await db.sync();
})();

  
  export default QuizzQuestionAnswer;

  QuizzQuestionAnswer.belongsTo(QuizzQuestion)  
  QuizzQuestion.hasMany(QuizzQuestionAnswer)  