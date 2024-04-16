import { Router } from "express";
import { addLecture, createCourse, deleteLecture, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from "../controllers/coures.contoller.js";
import { isLoggedIn, authorizedRoles, authorizedSubscriber } from "../middlewares/auth.middleware.js";
import Upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/')
.get(getAllCourses)
.post(Upload.single('thumbNail'),createCourse);

router.route('/:courseId')
.get(isLoggedIn,authorizedSubscriber,getLecturesByCourseId)
.put(isLoggedIn,authorizedRoles('ADMIN'),updateCourse)
.delete(isLoggedIn,authorizedRoles('ADMIN'),removeCourse)
.post(isLoggedIn,authorizedRoles('ADMIN'),Upload.single('lecture'),addLecture)

router.route('/delete/lecture').post(deleteLecture);

export default router;