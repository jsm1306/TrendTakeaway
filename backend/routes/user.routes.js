import express from 'express';
import { createUser, getUsers, updateUser, deleteUser, getUserByAuth0Id } from '../controllers/user.controller.js';
import checkJwt from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/', checkJwt, createUser);

router.get('/', checkJwt, getUsers);
router.get('/:auth0Id', checkJwt, getUserByAuth0Id); 

router.put('/:id', checkJwt, updateUser);

router.delete('/:id', checkJwt, deleteUser);

export default router;
