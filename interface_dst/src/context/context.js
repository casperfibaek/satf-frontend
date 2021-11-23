import * as React from "react";
export const UserContext = React.createContext({});
export const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState({});
    const setGlobalUser = (userID) => setUser(userID);
    return (React.createElement(UserContext.Provider, { value: {
            user,
            setGlobalUser
        } }, children));
};
export const useGlobalContext = () => {
    const context = React.useContext(UserContext);
    return context;
};
//# sourceMappingURL=Context.js.map