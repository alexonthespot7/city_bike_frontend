import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Import from "../Components/Import";
import Journeys from "../Components/Journeys";
import Stations from "../Components/Stations";

function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname} >
                <Route path="/" element={<Journeys />} />
                <Route path="/import" element={<Import />} />
                <Route path="/stations" element={<Stations />} />
                <Route
                    path="*"
                    element={
                        <Navigate to={{ pathname: "/" }} />
                    }
                />
            </Routes>
        </AnimatePresence>
    )
}

export default AppRoutes;
