import express from 'express';
import {
    createUser,
    deleteUser,
    getUsers,
    getUsersById,
    updateUser
} from '../controllers/Users';
import { verifyUser, adminOnly } from '../middleware/AuthUser';

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUsersById);
router.post('/users', verifyUser, adminOnly, createUser);
router.patch('/users/:id', verifyUser, adminOnly, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

export default router;