import { Router } from "express";
import { contact, forgotPassword, getProfile, login, logout, register, resetPassword, updatePassword, updateProfile } from "../controllers/userController.js";
import {isLoggedIn} from "../middlewares/auth.middleware.js";
import Upload from "../middlewares/multer.middleware.js";

const router = Router();


router.post('/register',Upload.single('avatar'),register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',isLoggedIn,getProfile);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);
router.post('/updatePassword',isLoggedIn,updatePassword);
router.put('/update/:id',isLoggedIn,Upload.single('avatar'),updateProfile)
router.post('/contact',isLoggedIn,contact)


export default router;