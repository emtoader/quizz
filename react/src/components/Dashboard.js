/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate  } from 'react-router-dom';
import QuizzDataService from '../services/quizz.service.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux'
import { setAuthName, setRefreshToken } from '../redux/authReducer'
 
const Dashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [updateQuizzes, setUpdateQuizzes] = useState(0);
    const history = useNavigate ();
    const stateRef = useRef();
    stateRef.quizzes = quizzes;

    
    const dispatch = useDispatch()
 
    useEffect(() => {
        refreshToken();
        
    }, []);

    useEffect(() => {
        
        if(token.length > 0){
            getUserQuizzes();
        }
        
    }, [token]);

    useEffect(() => {
        
        if(token.length > 0){
            getUserQuizzes();
        }
        
    }, [updateQuizzes]);
 
    const refreshToken = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL+'/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);

            dispatch( setAuthName(decoded.name) )
            dispatch( setRefreshToken(response.data.accessToken) )

            return response.data.accessToken
        } catch (error) {
            if (error.response) {
                history("/login");
            }
        }
    }
 
  


    const getUserQuizzes = async () => {

        try {
            const response = await QuizzDataService.getUserQuizzes(token);

            setQuizzes(response.data)
            

        } catch (error) {
            if (error.response) {
                console.log('Error: ',error.response)
            }
        }

    }

    const deleteQuiz = async (quizId) => {
        
        let token = await refreshToken()

        try {
            const response = await QuizzDataService.delete(quizId,token);

            toast.success(response.data.msg, {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

            let newQuizzList =  [...quizzes]

            newQuizzList.filter(quizz => quizz.id === quizId)

            setQuizzes(newQuizzList)

            setUpdateQuizzes( updateQuizzes + 1 )

        } catch (error) {
            if (error.response) {
                console.log('Error: ',error.response)
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

            <h1 className="title is-3">Your quizzes:</h1>

            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quiz, index) => {
                        return (
                            <tr key={index + quizzes.length}>
                                <td>{quiz.id + 1}</td>
                                <td>{quiz.name}</td>
                                <td><a href={ '/quizz/'+quiz.slug }><button className='button'>Take Quizz</button></a><button className='button is-danger' onClick={ () => { deleteQuiz(quiz.id) } }>Delete</button></td>
                            </tr>
                        )
                    })}
 
                </tbody>
            </table>
        </div>
    )
}
 
export default Dashboard