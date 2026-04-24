export const truncarTexto = (texto: string | string[] | undefined, limite: number) => {
    if (!texto) return "";
    const stringBase = Array.isArray(texto) ? texto.join(", ") : texto;
    const palabras = stringBase.split(" ");
    return palabras.length <= limite
        ? stringBase
        : palabras.slice(0, limite).join(" ") + "...";
};