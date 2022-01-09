import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Teams from "./components/old/Teams";
import Project from "./components/Project";
import Home from "./components/Home";
import SprintBacklog from "./components/SprintBacklog";
const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/teams" element={<Teams/>}/>
            <Route path={`/:owner/:name`} element={<Project/>}/>
            <Route path={`/:owner/:name/Sprints/:number`} element={<SprintBacklog/>}/>
            <Route path={`/:owner/:name/active-sprint`} element={<SprintBacklog/>}/>
        </Routes>
    );
}

export default AppRouter;