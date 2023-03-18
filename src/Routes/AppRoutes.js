import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Import from "../Components/Import";

function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname} >
                <Route path="/" element={<Import />} />
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
