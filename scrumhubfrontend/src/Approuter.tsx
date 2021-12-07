import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Teams from "./components/Teams";
import Project from "./components/Project";
import Home from "./components/Home";
import SprintList from "./components/SprintList";
import SprintBacklog from "./components/SprintBacklog";
const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/teams" element={<Teams/>}/>
            <Route path={`/:owner/:name`} element={<Project/>}/>
            <Route path={`/:owner/:name/sprints`} element={<SprintList/>}/>
            {<Route path={`/:owner/:name/sprints/:number`} element={<SprintBacklog/>}/>}
        </Routes>
    );
}

export default AppRouter;