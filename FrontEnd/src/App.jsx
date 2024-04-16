import './App.css'
import {Route, Routes} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import AboutUs from './Pages/AboutUsPage'
import NotFound from './Pages/NotFound'
import SignUp from './Pages/SignUpPage'
import Login from './Pages/LoginPage'
import CourseList from './Courses/CourseList'
import ContactUs from './Pages/ContactUs'
import Denied from './Pages/Denied'
import CourseDescription from './Courses/CourseDescription'
import RequireAuth from './Auth/RequireAuth'
import CreateCourse from './Courses/CreateCourse'
import UserProfile from './User/UserProfile'
import EditProfile from './User/EditProfile'
import Checkout from './Payment/Checkout'
import Checkoutsuccess from './Payment/Checkoutsuccess'
import Checkoutfailure from './Payment/Checkoutfailure'
import DisplayLectures from './Dashboard/DisplayLectures'
import AddLecture from './Dashboard/AddLecture'
import AdminDashboard from './Dashboard/AdminDashboard'
import Live from './LiveLecture/Live'
import Meeting from './LiveLecture/Meeting'
import SearchPage from './Courses/SeachPage'
import CreateRoom from './LiveLecture/CreateRoom'
import JoinRoom from './LiveLecture/JoinRoom'
import Whiteboard from './LiveLecture/Whiteboard'
function App() {

  return (
    <>
      <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/about' element={<AboutUs />} />

          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />

          <Route path='/courses' element={<CourseList />} />
          <Route path='/course/description' element={<CourseDescription />} />

          <Route path='/contact' element={<ContactUs />} />

          <Route element={<RequireAuth allowerRoles={['ADMIN']}/>}> 
                <Route path='/course/create' element={<CreateCourse />} />
                <Route path='/course/addLecture' element={<AddLecture />} />
                <Route path='/admin/dashboard' element={<AdminDashboard />} />
                <Route path='/admin/record' element={<Live />} />

                <Route path='/createRoom' element={<CreateRoom />} />

          </Route>

          <Route element={<RequireAuth allowerRoles={['ADMIN','USER']}/>}> 
                <Route path='/user/profile' element={<UserProfile />} />
                <Route path='/user/editprofile' element={<EditProfile />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/checkout/success' element={<Checkoutsuccess />} />
                <Route path='/checkout/fail' element={<Checkoutfailure />} />
                <Route path='/course/displayLectures' element={<DisplayLectures />} />
                <Route path='/searchPage' element={<SearchPage />} />

                <Route path='/joinRoom' element={<JoinRoom />} />

                
                <Route path='/whiteBoard' element={<Whiteboard />} />
          </Route>

          <Route path='/denied' element={<Denied />} />

          {/* if path not found */}
          <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
