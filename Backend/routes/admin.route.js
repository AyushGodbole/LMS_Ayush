import { Router } from "express";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import getUserStats from "../controllers/admin.controller.js";


const router = Router();


router.route('/stats/users')
.get(isLoggedIn,authorizedRoles("ADMIN"),getUserStats);



export default router;