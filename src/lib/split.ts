/** Utilitário simples para partir texto em letras/palavras com máscara. */
export const chars = (text: string) => Array.from(text)
export const words = (text: string) => text.split(/\s+/).filter(Boolean)
