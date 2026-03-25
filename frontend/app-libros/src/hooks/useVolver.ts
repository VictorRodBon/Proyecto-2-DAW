import { useLocation, useNavigate } from "react-router-dom";

export function useVolver() {
    const navigate = useNavigate();
    const location = useLocation();

    const volver = () => {
        // Si venimos de una búsqueda, conservamos sus parámetros en la URL.
        if (location.search) {
            navigate(`/search${location.search}`);
            return;
        }

        if (typeof window !== "undefined" && window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate("/search");
    };

    return { volver };
}
