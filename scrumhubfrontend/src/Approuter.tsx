import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
<<<<<<< HEAD
import SprintList from './components/SprintList';
import Teams from "./components/Teams";
import Project from "./components/Project";
import Home from "./components/Home";
import SprintBacklog from "./components/SprintBacklog";
=======
import Home from './components/Home';
import Teams from "./components/Teams";
import Project from "./components/Project";
>>>>>>> 1fed599254bdb219c15c836716e38e42b8843ad9
const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/teams" element={<Teams/>}/>
            <Route path={`/:owner/:name`} element={<Project/>}/>
<<<<<<< HEAD
            <Route path={`/:owner/:name/sprints`} element={<SprintList/>}/>
            <Route path={`/:owner/:name/sprints/:number`} element={<SprintBacklog/>}/>
=======
>>>>>>> 1fed599254bdb219c15c836716e38e42b8843ad9
        </Routes>
    );
}

export default AppRouter;