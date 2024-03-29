import { Routes, Route } from "react-router-dom";
import {Login} from './components/Login';
import {Project} from "./components/Project";
import {Home} from "./components/Home";
import {SprintBacklog} from "./components/SprintBacklog";

/**
 * @returns Routes that link to all subviews of SPA
 */
export function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path={`/:owner/:name`} element={<Project />} />
            <Route path={`/:owner/:name/Sprints/:number`} element={<SprintBacklog />} />
            <Route path={`/:owner/:name/active-sprint/:number`} element={<SprintBacklog />} />
        </Routes>
    );
}