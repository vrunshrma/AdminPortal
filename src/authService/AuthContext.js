import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchUserDetails } from "./PrivateAuthService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null to handle loading state

    const checkAuth = async () => {
        console.log("Checking authentication status");
        const token = localStorage.getItem("token");

        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            navigate("/login");
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp < currentTime) {
                console.warn("Token expired. Logging out.");
                logout();
                return;
            }

            if (decodedToken.token_type === "password_reset") {
                console.warn("Password reset token. Redirecting to reset password page.");
                setIsAuthenticated(true); // Don't mark as authenticated
                return;
            }

            const response = await fetchUserDetails(decodedToken.userId);
            console.log("User details from checkAuth:", response.data.response);
            setUser(response.data.response);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            logout();
        }
    };

    // Run checkAuth initially
    useEffect(() => {
        console.log("AuthProvider mounted - Checking initial authentication");
        checkAuth();

        const handleAuthChange = () => {
            console.log("AuthChange event triggered");
            checkAuth();
        };

        window.addEventListener("authChange", handleAuthChange);

        return () => {
            console.log("AuthProvider unmounted - Removing authChange listener");
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

    // Run checkAuth only when `isAuthenticated` changes and is `true`
    useEffect(() => {
        let interval;
        if (isAuthenticated) {
            console.log("User is authenticated - starting interval to check token expiry...");
            interval = setInterval(() => {
                checkAuth();
            }, 60000);
        }

        return () => {
            if (interval) {
                console.log("Clearing token check interval");
                clearInterval(interval);
            }
        };
    }, [isAuthenticated]);

    // Listen for localStorage changes (to sync authentication state across tabs)
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "token") {
                console.log("Storage change detected for token. Checking auth...");
                checkAuth();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const setUserDetails = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("authChange")); // Notify other parts of the app
        localStorage.setItem("logoutEvent", Date.now()); // Sync logout across tabs
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, setUserDetails, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
