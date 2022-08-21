/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate  } from 'react-router-dom';
import CreateQuizzQuestion from './CreateQuizzQuestion';
import { render } from '@testing-library/react';
 
const CreateQuizz = () => {
    const [numberOfQuestions, setNumberOfQuestions] = useState(2);
    const [numberOfAnswersPerQuestion, setNumberOfAnswersPerQuestion] = useState( [ 2, 3 ] );
    const [questionFields, setQuestionFields] = useState([]);
    const [formData, setFormData] = useState([]);
    const [name, setName] = useState('');
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

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
    }

    
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');


            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
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

        if( typeof newState['questions'] === 'undefined' ) {

            newState.questions = []

        }

        if( typeof newState['questions'][questionIndex] === 'undefined' ) {

            newState['questions'][questionIndex] = []

        }

        newState['questions'][questionIndex]['title'] = el.target.value

        setFormData( newState )

   }

const setAnswers = ( el, questionIndex, answerIndex ) => {

    

    let newState = formData

    if( typeof newState.questions === 'undefined' ) {

        newState['questions'] = []

    }

    if( typeof newState.questions[questionIndex] === 'undefined' ) {

        newState['questions'][questionIndex] = {}

    }

    if( typeof newState.questions[questionIndex]['answers'] === 'undefined' ) {

        newState['questions'][questionIndex]['answers'] = {}

    }

    if( typeof newState.questions[questionIndex]['answers'][answerIndex] === 'undefined' ) {

        newState['questions'][questionIndex]['answers'][answerIndex] = {}

    }

    newState['questions'][questionIndex]['answers'][answerIndex]['text'] = el.target.value

    setFormData( newState )

}

const createQuestionFields = async ( startFromIndex ) => {

        let questions = []

        for( let i = 0; i < numberOfQuestions; i++ ){

            questions.push(<CreateQuizzQuestion key={i} onDelete={ (questionIndex) => { deleteQuestion(questionIndex) } } numberOfAnswers={ numberOfAnswersPerQuestion[i] } questionKey={i} onChange={ (el) => { setQuestions(el, i) } } onAnswerChange={ (el, questionIndex, answerIndex) => { setAnswers(el, questionIndex, answerIndex) } }   />)

        }

        setQuestionFields(questions) 
      
}


const deleteQuestion = (questionIndex) =>{

    let newQuestionFields = []

    newQuestionFields = stateRef.questionFields.slice() //change reference

    let findIndex;
    newQuestionFields.forEach((el,index) => {

        if(parseInt(el.key) == parseInt(questionIndex)){
            newQuestionFields.splice(index, 1)
            findIndex = index
        }

    })

    setQuestionFields(newQuestionFields)

    let newFormData = formData
    if( typeof newFormData['questions'] != 'undefined' ){
        newFormData['questions'].splice(questionIndex, 1)
        setFormData(newFormData)
    }
    

}

const addQuestion = async (e) =>{

    e.preventDefault()

    let questions = stateRef.questionFields.slice()

    let newQuestionKey = 0
    if( typeof questions.at(-1) != 'undefined' ){
        newQuestionKey = parseInt(questions.at(-1).key) + 1
    }

    

    questions.push(<CreateQuizzQuestion key={newQuestionKey} onDelete={ (newQuestionKey) => { deleteQuestion(newQuestionKey) } } numberOfAnswers={ numberOfAnswersPerQuestion[newQuestionKey] } questionKey={newQuestionKey} onChange={ (el) => { setQuestions(el, newQuestionKey) } } onAnswerChange={ (el, questionIndex, answerIndex) => { setAnswers(el, questionIndex, answerIndex) } }   />)

    setQuestionFields(questions) 
    
}

 

    
    return (
        <div className="container mt-5">
            <h1>Welcome Back: {name}</h1>
            <div className="columns">
                <div className='column is-half'>
                    <form  onSubmit={handleSubmit}>
                        Create a new quizz:
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

                        <button className="button is-danger" onClick={(e) => addQuestion(e)}>
                            <span className="icon">
                                <i className="fas fa-home"></i>
                            </span>
                            Add Question
                        </button>

                        

                        <input className='button is-link' onClick={(e) => { handleSubmit(e) }} type="submit" value="Submit" />
                    </form>
                </div>
            </div>

        </div>
    )
}
 
export default CreateQuizz