import { useNavigate } from "react-router-dom";

interface BotonDetalleProps {
    authorName: string;
    bookKey: string;
    cover?: string;
    params?: string;
}

export const BotonDetalle = ({ authorName, bookKey, cover, params }: BotonDetalleProps) => {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => {
                navigate(`/detalle/${bookKey}/${cover || ''}`, {
                    state: { authorName, userId: params?.replace('/', '') },
                });
            }}
        >
            DETALLE
        </button>
    )
}