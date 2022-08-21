import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/users.controller.js";
import { getAllQuizzes, addQuizz, getQuizz, calculateScore, getUserQuizzes, deleteQuizz } from "../controllers/quizz.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { validateQuizz } from "../middleware/quizzValidator.js";
import { validateUser } from "../middleware/userValidator.js";
import { refreshToken } from "../controllers/refresh.token.controller.js";
import { validate } from "express-validation"
 
const router = express.Router();
 
router.get('/users', verifyToken, getUsers);
router.post('/users', validate(validateUser), Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/quizzes',  getAllQuizzes); 
router.post('/quizzes', verifyToken, validate(validateQuizz), addQuizz);
router.delete('/quizzes/:_id', verifyToken, deleteQuizz); 
router.get('/quizz', getQuizz);
router.get('/get_user_quizzes', verifyToken, getUserQuizzes);
router.post('/calculate_quizz_score', calculateScore);
 
export default router; 