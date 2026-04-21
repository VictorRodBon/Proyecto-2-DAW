import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
//import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';

import styles from "./Menu.module.css";

import { servicioUsuarios } from "../../api/servicioUsuarios";

export const FadeMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        handleClose();
    };

    const handleLogout = async () => {
        await servicioUsuarios.logout();
        navigate("/");
        handleClose();
    };

    return (
        <div>
            <button 
                className={styles.menuButton} 
                aria-controls="fade-menu" 
                aria-haspopup="true" 
                onClick={handleClick}
            >
                <MenuIcon className={styles.icon} />
                Menú
            </button>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiPaper-root': {
                        background: 'rgba(11, 18, 32, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        mt: 1,
                        minWidth: 180,
                    }
                }}
            >
                <MenuItem 
                    onClick={() => handleNavigate('/search')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '14px',
                        fontWeight: 500,
                        px: 2.5,
                        py: 1.5,
                        '&:hover': {
                            background: 'rgba(99, 102, 241, 0.15)',
                        }
                    }}
                >
                    <SearchIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.7)' }} /> Buscar libros
                </MenuItem>
                {/* <MenuItem 
                    onClick={() => handleNavigate('/perfil')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '14px',
                        fontWeight: 500,
                        px: 2.5,
                        py: 1.5,
                        '&:hover': {
                            background: 'rgba(99, 102, 241, 0.15)',
                        }
                    }}
                >
                    <PersonIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.7)' }} /> Perfil
                </MenuItem> */}
                <MenuItem 
                    onClick={() => handleNavigate('/biblioteca')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '14px',
                        fontWeight: 500,
                        px: 2.5,
                        py: 1.5,
                        '&:hover': {
                            background: 'rgba(99, 102, 241, 0.15)',
                        }
                    }}
                >
                    <MenuBookIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.7)' }} /> Mi Biblioteca
                </MenuItem>
                <MenuItem 
                    onClick={handleLogout}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '14px',
                        fontWeight: 500,
                        px: 2.5,
                        py: 1.5,
                        '&:hover': {
                            background: 'rgba(99, 102, 241, 0.15)',
                        }
                    }}
                >
                    <ExitToAppIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.7)' }} /> Cerrar sesión
                </MenuItem>
            </Menu>
        </div>
    );
}
