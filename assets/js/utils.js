// utils.js
async function fetchComFallback(path, fallbackData) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Erro no fetch");
    return await res.json();
  } catch (err) {
    console.warn("Fetch falhou, a usar fallback:", path);
    return fallbackData;
  }
}
