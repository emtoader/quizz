import React, { useState, useEffect, useRef } from 'react'
import { useParams  } from "react-router-dom";
import QuizzDataService from '../services/quizz.service.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TakeQuizz = () => {

    const {slug} = useParams()

    const [quizzData, setQuizzData] = useState({ title:'', quizz_questions:[] })
    const [progress, setProgress] = useState(25)
    const [numberOfQuestions, setNumberOfQuestions] = useState(0)
    const [clickedAnswersIds, setClickedAnswersIds] = useState([])
    const [currentVisibleIndex, setCurrentVisibleIndex] = useState()
    const [showPrevBtn, setShowPrevBtn] = useState(0)
    const [showNextBtn, setShowNextBtn] = useState(0)
    const [showFinishBtn, setShowFinishBtn] = useState(0)
    const [quizzSubmitResponse, setQuizzSubmitResponse] = useState('')

    const _toast = (message, type) => {
        
        if(type === 'success'){
            toast.success(message, {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }

        if(type === 'error'){
            toast.error(message, {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }

    }

    useEffect(() => {
        getQuizz()
    },[])
    
    useEffect(() => {
        
        if(quizzData.quizz_questions.length > 0){
            setVisibleQuestion()
            updateProgressBar()
            updatePrevNextVisiblity()
        }

    },[currentVisibleIndex])

    const updateProgressBar = () => {

        setProgress( (currentVisibleIndex + 1) * 100 / numberOfQuestions  )

    }

    const updatePrevNextVisiblity = () => {

        if( (currentVisibleIndex + 1) === quizzData.quizz_questions.length ){
            setShowNextBtn(0)
            setShowFinishBtn(1)
        }else{
            setShowNextBtn(1)
            setShowFinishBtn(0)
        }

        if( currentVisibleIndex === 0 ){
            setShowPrevBtn(0)
        }else{
            setShowPrevBtn(1)
        }

    }

    const getQuizz = async () => {
        try {

            let response = await QuizzDataService.findBySlug(slug);

            response.data.quizz_questions[0].visible = 1

            setQuizzData(response.data)

            setNumberOfQuestions(response.data.quizz_questions.length)

            setCurrentVisibleIndex(0)
            
        } catch (error) {
            if (error.response) {
                console.log('Error: ',error.response)
            }
        }
    }

    const handleAnswerBtnClick = (answerId, questionIndex) => {

        let newClickedAnswersIds = clickedAnswersIds.slice()

        let questionType = quizzData.quizz_questions[questionIndex]['type'];
        
        if(questionType == 'singleChoice'){
            if (newClickedAnswersIds.filter(answers =>  parseInt(answers.questionIndex) == parseInt(questionIndex)).length > 0) {

                newClickedAnswersIds = newClickedAnswersIds.filter(answers =>  parseInt(answers.questionIndex) != parseInt(questionIndex) )         
    
            }
        }

        if (newClickedAnswersIds.filter(answers =>  parseInt(answers.answerId) == parseInt(answerId)).length > 0) {

            newClickedAnswersIds = newClickedAnswersIds.filter(answers =>  parseInt(answers.answerId) != parseInt(answerId) )         

        }else{

            newClickedAnswersIds.push({answerId: answerId, questionIndex: questionIndex})

        }

        setClickedAnswersIds(newClickedAnswersIds)


    }

    const _checkIfQuestionIsAnswered = (questionIndex) => {

        let isAnswered = false

        clickedAnswersIds.forEach((answer) => {
            if(answer.questionIndex === questionIndex) isAnswered = true
        })

        if( !isAnswered ) _toast('You must answer the question', 'error')

        return isAnswered

    }

    const handleNextPrev = (increment) => {

        let data = Object.assign({}, quizzData);

        let questionAnswered = ( increment > 0 ) ? _checkIfQuestionIsAnswered(currentVisibleIndex) : true //Make it work for Previous Btn

        if( !questionAnswered ) return false
        
        data.quizz_questions[currentVisibleIndex].visible = 0

        setQuizzData(data)

        setCurrentVisibleIndex( currentVisibleIndex + increment )
        

    }

    const setVisibleQuestion = () => {

        let data = Object.assign({}, quizzData);
        data.quizz_questions[currentVisibleIndex].visible = 1

        setQuizzData(data)

    }

    const submitQuizz = async () => {

        if( !_checkIfQuestionIsAnswered(currentVisibleIndex) ) return false

        try {

            let submitAnswers = []

            clickedAnswersIds.forEach(element => {
                submitAnswers.push(element.answerId)
            });

            let response = await QuizzDataService.calculateScore(submitAnswers);

            setQuizzSubmitResponse(response.data.msg)

            setShowNextBtn(0)
            setShowFinishBtn(0)
            setShowPrevBtn(0)

            setQuizzData({ title:'', quizz_questions:[] })

        } catch (error) {
            if (error.response) {
                console.log('Error: ',error.response)
            }
        }
    }

    return(
        <div className='container'>
            <ToastContainer
            position="top-right"
            autoClose={7000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
            <section className='hero'>
                <div className="box">
                    <h1 className="title is-1" style={styles.title}>{quizzData.name}</h1>

                    { quizzData.quizz_questions.map( ( question, questionIndex ) => {
                        return (
                            <div className="box question-box" style={(question.visible) ? styles.isVisible : styles.isNotVisible} key={questionIndex}>
                                <h2 className="title is-4" style={styles.title}>{question.question}</h2>
                                <h3 className="title qType is-6" style={styles.title}>{(question.type === 'singleChoice') ? 'Only one answer can be correct [ Single Choice ]' : 'Multiple answers can be correct [ Multiple Choice ]'}</h3>

                                <div className='columns'>
                                    <div className='column is-one-third'></div>
                                    <div className='column is-one-third'>
                                        <div className='columns'>

                                            { question.quizz_question_answers.map( (answer,index) => {

                                                return(
                                                        <div className='column' key={index}>
                                                            <button  onClick={  () => {handleAnswerBtnClick(answer.id, questionIndex)}  } className='button answer' style={( clickedAnswersIds.filter(answers =>  parseInt(answers.answerId) === parseInt(answer.id)).length > 0 ) ? styles.clickedAnswer : styles.answer }>{answer.answer}</button>
                                                        </div>
                                                    )

                                            }) }

                                        </div>
                                    </div>
                                    <div className='column is-one-third'></div>
                                </div>

                                

                            </div>
                        )
                    }) }

                    <div className='columns'>
                        <div className='column'>
                            { (showPrevBtn) ? <button  onClick={  () => { handleNextPrev(-1) }  } className='button prev' style={ styles.answer }>Previous Question</button> : '' }
                            
                        </div>
                        <div className='column'>
                            { ( showNextBtn ) ? <button  onClick={  () => { handleNextPrev(1) }  } className='button next' style={ styles.answer }>Next Question</button>: '' }
                            { ( showFinishBtn ) ? <button  onClick={  () => { submitQuizz() }  } className='button next' style={ styles.answer }>Submit Quiz</button>: '' }
                        </div>
                    </div>

                    {
                        (quizzSubmitResponse.length > 0) ? 
                            <div>
                                <div className="notification is-success">
                                    { quizzSubmitResponse }
                                </div>
                                <div className='columns'>
                                    <div className='column'>
                                        <button className='button' style={ { margin: '20px auto', display: 'block' } } onClick={() => {window.location.reload()}}>Take quizz again</button>
                                    </div>
                                </div>
                            </div>
                        :
                            <div>
                                 <span className="progressText">{progress.toFixed(0)}%</span>
                                  <progress className="progress is-primary is-small" value={progress} max="100"></progress>
                            </div>
                    }


                    
                </div>
            </section>
        </div>
    )

}

export default TakeQuizz

const styles = {
    title:{
        textAlign:'center'
    },
    answer:{
        margin:'0 auto',
        display: 'block'
    },
    clickedAnswer:{
        backgroundColor: '#5bbbff',
        color: 'white',
        margin:'0 auto',
        display: 'block'
    },
    isVisible:{
        display:'block',
        border: '1px solid lightgray'
    },
    isNotVisible:{
        display:'none'
    }
}