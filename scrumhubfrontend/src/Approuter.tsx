import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Teams from "./components/Teams";
const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/teams" element={<Teams/>}/>
        </Routes>
    );
}

export default AppRouter;