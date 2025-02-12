import express from 'express';
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller.js';
import checkJwt from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/', checkJwt, createUser);

router.get('/', checkJwt, getUsers);

router.put('/:id', checkJwt, updateUser);

router.delete('/:id', checkJwt, deleteUser);

export default router;
