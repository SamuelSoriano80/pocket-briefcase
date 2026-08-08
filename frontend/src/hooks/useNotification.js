import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useNotification() {
    const location = useLocation();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (location.state && location.state.notification) {
            setNotification(location.state.notification);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location]);

    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => {
            setNotification(null);
        }, 4000);

        return () => clearTimeout(timer);
    }, [notification]);

    return [notification, setNotification];
}