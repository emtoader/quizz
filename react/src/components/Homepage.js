/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import QuizzDataService from '../services/quizz.service.js';
 
const Homepage = () => {
    const [quizzes, setQuizzes] = useState([]);

    const navigate = useNavigate ();

    useEffect(() => {
        getQuizzes()
    },[])

    const getQuizzes = async () => {

        try {
            const response = await QuizzDataService.getAll();

            setQuizzes(response.data)

        } catch (error) {
            if (error.response) {
                console.log('Error: ',error.response)
            }
        }

    }

    return (
        <div className="container mt-5">
            <h1>Take one of our Quizz Tests:</h1>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quizz, index) => (
                        <tr key={quizz.id}>
                            <td>{index + 1}</td>
                            <td>{quizz.name}</td>
                            <td><a href={ '/quizz/'+quizz.slug }><button className='button'>Take Quizz</button></a></td>
                        </tr>
                    ))}
 
                </tbody>
            </table>
        </div>
    )
}
 
export default Homepage