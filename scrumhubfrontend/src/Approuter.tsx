import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Teams from "./components/Teams";
import Project from "./components/Project";
const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/teams" element={<Teams/>}/>
            <Route path={`/:owner/:name`} element={<Project/>}/>
        </Routes>
    );
}

export default AppRouter;