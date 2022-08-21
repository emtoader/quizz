/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate  } from 'react-router-dom';
import CreateQuizzQuestion from './CreateQuizzQuestion';
import QuizzDataService from '../services/quizz.service.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const CreateQuizz = () => {
    const [numberOfQuestions, setNumberOfQuestions] = useState(2);
    const [questionFields, setQuestionFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [name, setName] = useState('');
    const [notificationMaxNumberOfQuestions, setNotificationMaxNumberOfQuestions] = useState(false)
    const [error, setError] = useState(false)
    const [showBtns, setShowBtns] = useState(true)
    
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);

    const navigation = useNavigate ();
    const stateRef = useRef();
    stateRef.questionFields = questionFields;
  
    useEffect(() => {
        refreshToken();
        createQuestionFields()
    }, []);
 
    // useEffect(() => {
    //     console.log('questionFields',questionFields)
    // }, [questionFields]);

    const handleSubmit = async (e) => {
        e.preventDefault()


        let token = await refreshToken()

        try {

            let response = await QuizzDataService.create(formData, token);

            toast.success(response.data.msg, {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

            setShowBtns(false)
            
        } catch (error) {
            if (error.response) {
                 //console.log('Error: ',error.response) 
                
                toast.error(error.response.data.msg, {
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
    }

    
    const refreshToken = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL+'/token'); 


            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);

            return response.data.accessToken

        } catch (error) {
            if (error.response) {
                navigation("/");
            }
        }
    }
 
    const setTitle = ( el ) => {

         let newState = formData

         newState.title = el.target.value

         setFormData( newState )

    }

    const setQuestions = ( el, questionIndex ) => {

        let newState = formData

        if( typeof newState.questions === 'undefined' ) {

            newState.questions = {}

        }

        if( typeof newState.questions[parseInt(questionIndex)] === 'undefined' ) {

            newState.questions[parseInt(questionIndex)] = {}

        }

        newState.questions[parseInt(questionIndex)]['title'] = el.target.value

        if(typeof newState.questions[parseInt(questionIndex)]['type'] === 'undefined'){
            newState.questions[parseInt(questionIndex)]['type'] = 'singleChoice'
        }

        setFormData( newState )

   }

const setAnswers = ( el, questionIndex, answerIndex ) => {

    

    let newState = formData

    if( typeof newState.questions === 'undefined' ) {

        newState.questions = {}

    }

    if( typeof newState.questions[parseInt(questionIndex)] === 'undefined' ) {

        newState.questions[parseInt(questionIndex)] = {}

    }

    if( typeof newState.questions[parseInt(questionIndex)]['answers'] === 'undefined' ) {

        newState.questions[parseInt(questionIndex)]['answers'] = {}

    }

    if( typeof newState.questions[parseInt(questionIndex)]['answers'][parseInt(answerIndex)] === 'undefined' ) {

        newState.questions[parseInt(questionIndex)]['answers'][parseInt(answerIndex)] = {}

    }

    newState.questions[parseInt(questionIndex)]['answers'][parseInt(answerIndex)]['text'] = el.target.value

    if( typeof newState.questions[parseInt(questionIndex)]['answers'][parseInt(answerIndex)]['isTrue'] === 'undefined' ){
        newState.questions[parseInt(questionIndex)]['answers'][parseInt(answerIndex)]['isTrue'] = 0
    }

    setFormData( newState )

}

const setIsAnswerTrue = ( value, questionIndex, answerIndex ) => {


    let newState = formData

    if( typeof newState.questions === 'undefined' ) {

        newState.questions = {}

    }

    if( typeof newState.questions[parseInt(questionIndex)] === 'undefined' ) {

        newState.questions[parseInt(questionIndex)] = {}

    }

    if( typeof newState.questions[parseInt(questionIndex)]['answers'] === 'undefined' ) {

        newState.questions[parseInt(questionIndex)]['answers'] = {}

    }

    if( typeof newState.questions[parseInt(questionIndex)]['answers'][parseInt(answerIndex)] === 'undefined' ) {

        newState.questions[parseInt(questionIndex)]['answers'][parseInt(answerIndex)] = {}

    }

    newState.questions[parseInt(questionIndex)]['answers'][parseInt(answerIndex)]['isTrue'] = parseInt(value)

    setFormData( newState )

}

const createQuestionFields = async ( startFromIndex ) => {

        let questions = []

        for( let i = 0; i < numberOfQuestions; i++ ){

            questions.push(<CreateQuizzQuestion key={i}  questionKey={i} onNumberOfAnswersChange={ ( numberOfAnswers, questionIndex ) => { updateNumberOfAnswersPerQuestion(numberOfAnswers,questionIndex) } }  onTypeChange={( (el,questionIndex) => { setQuestionType(el,questionIndex) } )} onChange={ (el) => { setQuestions(el, i) } } onAnswerChange={ (el, questionIndex, answerIndex) => { setAnswers(el, questionIndex, answerIndex) } }  onIsTrueChange={ (el, questionIndex, answerIndex) => { setIsAnswerTrue( el, questionIndex, answerIndex ) } }  />)

        }

        setQuestionFields(questions) 
      
}

const setQuestionType = (elValue, questionIndex) => {

    let newState = formData

        if( typeof newState.questions === 'undefined' ) {

            newState.questions = {}

        }

        if( typeof newState.questions[parseInt(questionIndex)] === 'undefined' ) {

            newState.questions[parseInt(questionIndex)] = {}

        }

        newState.questions[parseInt(questionIndex)]['type'] = elValue

        setFormData( newState )

}

const removeQuestion = (e) =>{

    e.preventDefault()

    let newQuestionFields = []

    newQuestionFields = stateRef.questionFields.slice() //change reference

    if(newQuestionFields.length === 1){
        toast.warn('Minimum number of questions is 1', {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })

        return false
    }

    

    newQuestionFields.pop()

    setQuestionFields(newQuestionFields)

    //unset data from form as well
    let newFormData = formData
    if( typeof newFormData['questions'] != 'undefined' ){
        let keys = Object.keys(newFormData['questions'])
        delete newFormData['questions'][keys[keys.length-1]]
        setFormData(newFormData)
    }
    

}

const addQuestion = async (e) =>{

    e.preventDefault()

    let questions = stateRef.questionFields.slice() //change ref

    if(questions.length > 9){
        
        toast.warn('Maximum number of questions is 10', {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })

        return false
    }

    let newQuestionKey = 0
    if( typeof questions.at(-1) != 'undefined' ){
        newQuestionKey = parseInt(questions.at(-1).key) + 1
    }

    questions.push(<CreateQuizzQuestion key={newQuestionKey} onNumberOfAnswersChange={ ( numberOfAnswers, questionIndex ) => { updateNumberOfAnswersPerQuestion(numberOfAnswers,questionIndex) } } questionKey={newQuestionKey} onTypeChange={( (el, questionIndex) => { setQuestionType(el,questionIndex) } )} onChange={ (el) => { setQuestions(el, newQuestionKey) } } onAnswerChange={ (el, questionIndex, answerIndex) => { setAnswers(el, questionIndex, answerIndex) } }  onIsTrueChange={ (el, questionIndex, answerIndex) => { setIsAnswerTrue( el, questionIndex, answerIndex ) } }   />)

    setQuestionFields(questions) 

    let newFormData = formData

    if( typeof newFormData.questions === 'undefined' ) newFormData.questions = {}
    
    newFormData.questions[newQuestionKey] = {}

    setFormData(newFormData)
   
    
}

const updateNumberOfAnswersPerQuestion = ( numberOfAnswers, questionIndex ) => {

    let answerMaxIndex = numberOfAnswers - 1

    let newFormData = formData

    if( typeof newFormData.questions !== 'undefined' && typeof newFormData.questions[questionIndex] !== 'undefined'  && typeof newFormData.questions[questionIndex].answers !== 'undefined'){

        let keys = Object.keys(newFormData.questions[questionIndex].answers)

        for( let i = 0; i < keys.length; i++ ){

            if( i > answerMaxIndex ){

                delete newFormData['questions'][questionIndex].answers[i]
       
            }

        }

        

        
    }
    
    setFormData(newFormData)

}

 

    
    return (
        
        <div className="container mt-5">
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
            <h1>Welcome Back: {name}</h1>
            <div className="columns">
                <div className='column is-half'>
                    <form  onSubmit={(e) => handleSubmit(e)}>
                        Create a new quizz:
                        <h1 className="title is-3">Create a new quizz:</h1>
                        <div className="field">
                            <label className="label">Quizz Title</label>
                            <div className="control">
                                <input className="input" onChange={ (el) => { setTitle(el) } } type="text" placeholder="Text input" /> 
                            </div>
                        </div>

                        {

                            questionFields.map((el,index) => {

                                return el

                            }) 

                        }

                        {(notificationMaxNumberOfQuestions) ? <div className="notification is-danger">Maximum number of questions is 10 per quiz.</div> : '' }
                        {(error !== false) ? <div className="notification is-danger">{error}</div> : '' }

                        { (showBtns) ? 
                            <div>
                                <button className="button" onClick={(e) => addQuestion(e)}>
                                    <span className="icon">
                                        <i className="fas fa-home"></i>
                                    </span>
                                    Add Question
                                </button>

                                <button className="button is-danger" onClick={(e) => removeQuestion(e)}>
                                    <span className="icon">
                                        <i className="fas fa-home"></i>
                                    </span>
                                    Remove Question
                                </button>

                                <input className='button is-link' type="submit" value="Publish" />
                                
                            </div>
                        :
                                <div>
                                    <a className="button" href="/dashboard">
                                        <span className="icon">
                                            <i className="fas fa-home"></i>
                                        </span>
                                        View My Quizzes
                                    </a>
                                </div>
                        }

                        
                    </form>
                </div>
            </div>

        </div>
    )
}
 
export default CreateQuizz