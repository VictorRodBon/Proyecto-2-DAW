const LLAVE_TOKEN = "sb-qnwjmetgvbyitgrloosg-auth-token";

export function obtenerTokenAutenticacion(): string | null {
  const token = localStorage.getItem(LLAVE_TOKEN);

  if (token === null) {
    return null;
  }

  return token;
}


export function estaAutenticado(): boolean {
  const token = obtenerTokenAutenticacion();

  if (token === null) {
    return false;
  }

  if (token.trim() === "") {
    return false;
  }

  return true;
}