import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MiMenu } from "../componente-menu/Menu";
import SearchIcon from '@mui/icons-material/Search';
import styles from "./Layout.module.css";
import menuStyles from "../componente-menu/Menu.module.css";

export function LayoutPrincipal() {
    const navigate = useNavigate();

    const [busquedaTitle, setBusquedaTitle] = useState("");
    const [busquedaAuthor, setBusquedaAuthor] = useState("");
    const [cantidad, setCantidad] = useState(10);
    const [buscadorExpandido, setBuscadorExpandido] = useState(false);
    const [esMovil, setEsMovil] = useState(false);

    useEffect(() => {
        const manejarResize = () => {
            setEsMovil(window.innerWidth < 860);
        };
        manejarResize();
        window.addEventListener('resize', manejarResize);
        return () => window.removeEventListener('resize', manejarResize);
    }, []);

    const handleBuscar = () => {
        const q = busquedaTitle.trim();
        if (!q) return;

        const params = new URLSearchParams();
        params.set("q", q);
        params.set("page", "1");
        params.set("limit", String(cantidad));

        const author = busquedaAuthor.trim();
        if (author) {
            params.set("author", author);
        }

        navigate(`/search?${params.toString()}`);
        
        if (esMovil) {
            setBuscadorExpandido(false); 
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleBuscar();
        }
    };

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <MiMenu />
                {esMovil ? (
                    <div className={styles.buscadorMovil}>
                        <button
                            className={`${styles.botonExpandir} ${menuStyles.menuButton}`}
                            onClick={() => setBuscadorExpandido(!buscadorExpandido)}
                        >
                            <SearchIcon className={menuStyles.icon} />
                            {buscadorExpandido ? "Ocultar" : "Buscar"}
                        </button>
                        {buscadorExpandido && (
                            <div className={styles.formularioExpandido}>
                                <input
                                    className={styles.inputTexto}
                                    type="text"
                                    value={busquedaTitle}
                                    onChange={(e) => setBusquedaTitle(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe un título..."
                                />
                                <input
                                    className={styles.inputTexto}
                                    type="text"
                                    value={busquedaAuthor}
                                    onChange={(e) => setBusquedaAuthor(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe un autor..."
                                />
                                <input
                                    className={styles.botonBuscar}
                                    type="button"
                                    value="Buscar"
                                    onClick={handleBuscar}
                                />
                                <select
                                    className={styles.selectCantidad}
                                    name="cantidad"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(Number(e.target.value))}
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.controles}>
                        <input
                            className={styles.inputTexto}
                            type="text"
                            value={busquedaTitle}
                            onChange={(e) => setBusquedaTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe un título..."
                        />
                        <input
                            className={styles.inputTexto}
                            type="text"
                            value={busquedaAuthor}
                            onChange={(e) => setBusquedaAuthor(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe un autor..."
                        />

                        <button
                            className={styles.botonExpandir}
                            type="button"
                            onClick={handleBuscar}
                        >
                            <SearchIcon className={styles.iconoBuscar} />
                            Buscar
                        </button>
                        <select
                            className={styles.selectCantidad}
                            name="cantidad"
                            value={cantidad}
                            onChange={(e) => setCantidad(Number(e.target.value))}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                )}
            </header>
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}