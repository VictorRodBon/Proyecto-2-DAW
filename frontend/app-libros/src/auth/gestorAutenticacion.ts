const LLAVE_TOKEN = "sb-qnwjmetgvbyitgrloosg-auth-token";

export function obtenerTokenAutenticacion(): string | null {
  const token = localStorage.getItem(LLAVE_TOKEN);

  if (token === null) {
    return null;
  }

  return token;
}

export function guardarTokenAutenticacion(token: string): void {
  if (token === null) {
    return;
  }

  if (token.trim() === "") {
    return;
  }

  localStorage.setItem(LLAVE_TOKEN, token);
}

export function quitarTokenAutenticacion(): void {
  const token = localStorage.getItem(LLAVE_TOKEN);

  if (token !== null) {
    localStorage.removeItem(LLAVE_TOKEN);
  }
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
