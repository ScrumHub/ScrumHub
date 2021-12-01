import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/teams" />
        </Routes>
    );
}

export default AppRouter;