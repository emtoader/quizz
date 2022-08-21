
import Quizz from "../models/quizz.model.js";
import QuizzQuestion from "../models/quizzQuestion.model.js";
import QuizzQuestionAnswer from "../models/quizzQuestionAnswer.model.js";
import Users from "../models/user.model.js";
import crypto from "crypto"

export const getAllQuizzes = async(req, res) => {
    try {

        let queryOptions = {
            attributes:['id','name','slug']
        }

        const quizzes = await Quizz.findAll(queryOptions);
        res.json(quizzes);
    } catch (error) {
        console.log(error);
    }
}

export const getQuizz = async(req, res) => {
    try {

        if(typeof req.query.slug === 'undefined'){
            res.sendStatus(404);
        }

        let queryOptions = {
            attributes:['id','name','slug']
        }
        queryOptions.where = { slug: req.query.slug  }
        queryOptions.include = [{model: QuizzQuestion, attributes:['id','question','order','type'] ,include:[{model: QuizzQuestionAnswer, attributes:['id','answer','order']}]}]
        
        const quizz = await Quizz.findOne(queryOptions);
        res.json(quizz);

    } catch (error) {
        console.log(error);
    }
}

export const getUserQuizzes = async(req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(204);
        const userId = user[0].id;

        let queryOptions = {
            attributes:['id','name','slug']
        }
        queryOptions.where = { userId: userId  }

        const quizz = await Quizz.findAll(queryOptions);
        res.json(quizz);

    } catch (error) {
        console.log(error);
    }
}

export const deleteQuizz = async (req, res) => {

    try{

    const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(204);
        const userId = user[0].id;

        let queryOptions = { where: {userId: userId, id: req.params._id}  }

        const quizz = await Quizz.destroy(queryOptions);

        if( quizz ){
            res.json({msg:'Quiz deleted!'});
        }else{
            res.status(404).json({msg:'Quiz not found'});
        }

    } catch (error) {
        console.log(error);
    }

}

export const calculateScore = async(req, res) => {
    try {



        let queryOptions = {
            attributes:['id','isCorrect','quizzQuestionId'],
            where: { id: req.body }
        }

        queryOptions.include = [{model: QuizzQuestion, attributes:['id','quizId'] }]

        const userAnswers = await QuizzQuestionAnswer.findAll(queryOptions);


        if(userAnswers.length < 1) res.json({msg: "Your score is 0", success:1});

        queryOptions = {
            attributes:['id'],
            where: { id: userAnswers[0].dataValues.quizz_question.dataValues.quizId }
        }

        queryOptions.include = [{model: QuizzQuestion, attributes:['id','question'] ,include:[{model: QuizzQuestionAnswer, attributes:['id','isCorrect']}]}]

        const quizAnswers = await Quizz.findOne(queryOptions);

        let totalNumberOfQuestions = quizAnswers.dataValues.quizz_questions.length
        let correctQuestions = 0

        quizAnswers.dataValues.quizz_questions.forEach( (quizzQuestion, index) => {

            let questionData = quizzQuestion.dataValues

            let isQuestionCorrect = true

            questionData.quizz_question_answers.forEach( (answer) => {

                if( answer.dataValues.isCorrect ){
                    if( !req.body.includes( answer.dataValues.id ) ){
                        isQuestionCorrect = false
                    }
                }

                if( !answer.dataValues.isCorrect ){
                    if( req.body.includes( answer.dataValues.id ) ){
                        isQuestionCorrect = false
                    }
                }

            })

            if(isQuestionCorrect) correctQuestions++

        })

        let percentage = (correctQuestions * 100) / totalNumberOfQuestions

        res.json({msg: "Score is "+correctQuestions+"/"+totalNumberOfQuestions, numberOfCorrectQuestions: correctQuestions, totalNumberOfQuestions: totalNumberOfQuestions, scorePercentage: percentage, success:1});

    } catch (error) {
        console.log(error);
    }
}

const _deleteQuizz = ( quizzId ) => {

    let queryOptions = { where: {id: quizzId}  }

    Quizz.destroy(queryOptions);

}

export const addQuizz = async(req, res) => {
    try {
        const {title, questions} = req.body;
        const refreshToken = req.cookies.refreshToken;
        let quizzId = false

        

        try {

            let user = await Users.findOne({
                where:{
                    refresh_token: refreshToken
                }
            })


            let quizzData = await Quizz.create({
                name: title,
                userId: user.dataValues.id,
                slug: await generateUniqueSlug()
            });

            quizzId = quizzData.dataValues.id

            if(typeof questions === 'undefined'){
                _deleteQuizz(quizzId)
                res.status(400).json({msg: "Quiz must have at least 1 question.", success:0});
                return false 
            }

            for( let i = 0; i < Object.keys(questions).length; i++ ){

                let questionData = await QuizzQuestion.create({
                    question: questions[i].title,
                    type: questions[i].type,
                    order: i,
                    quizId: quizzId,
                }); 

                let atLeastOneAnswerCorrect = false

                if( typeof questions[i].answers === 'undefined' ){

                    _deleteQuizz(quizzId)

                    res.status(400).json({msg: "All questions must have set at least two answers.", success:0});
                    return false
                }

                let numberOfCorrectAnswers = 0;

                for( let j = 0; j < Object.keys(questions[i].answers).length; j++ ){

                    if(questions[i].answers[j].isTrue){
                        atLeastOneAnswerCorrect = true
                        numberOfCorrectAnswers++;
                    } 

                    if(questions[i].type === 'singleChoice' && numberOfCorrectAnswers > 1){
                        _deleteQuizz(quizzId)
                        res.status(400).json({msg: "Single Choice questions cannot have more than one correct answer.", success:0});
                        return false
                    }

                    await QuizzQuestionAnswer.create({
                        answer: questions[i].answers[j].text,
                        isCorrect: questions[i].answers[j].isTrue,
                        order: j,
                        quizzQuestionId: questionData.dataValues.id,
                    });

                }

                if(!atLeastOneAnswerCorrect){
                    _deleteQuizz(quizzId)
                    res.status(400).json({msg: "At least one answer for each question needs to be TRUE.", success:0});
                    return false
                }

            }

            res.json({msg: "Quizz created successfully.", success:1});
            
        } catch (error) {
            console.log(error);
            res.status(400).json({msg: "Error: Quizz could not be created.", success:0});
        }

    } catch (error) {
        console.log(error); 
    }
}

const generateUniqueSlug = async () =>{

    let randomSlug;

    let isUnique = false

    while( isUnique === false ){

        randomSlug = crypto.randomBytes(3).toString('hex')

        isUnique = true

        //check if slug already exists
        try {
            const quizz = await Quizz.findOne({
                where:{
                    slug: randomSlug
                }
            })
            
            if(quizz !== null) isUnique = false

        } catch (error) {
            console.log(error);
            isUnique = false
        }

    }

    return randomSlug

}