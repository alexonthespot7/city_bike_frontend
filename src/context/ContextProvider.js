import { useState } from "react";

import AuthContext from "./AuthContext";

function ContextProvider(props) {
    const [isAlert, setIsAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMsg, setAlertMsg] = useState('');

    return (
        <AuthContext.Provider value={{
            isAlert, setIsAlert, alertType, setAlertType, alertMsg, setAlertMsg
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default ContextProvider;