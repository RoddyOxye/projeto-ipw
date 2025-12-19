// utils.js
// Helper único: tenta fetch normal e devolve dados locais se falhar.
async function fetchComFallback(path, fallbackData) {
  if (window.location.protocol === "file:") {
    return fallbackData;
  }
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Erro no fetch");
    return await res.json();
  } catch (err) {
    console.warn("Fetch falhou, a usar fallback:", path);
    return fallbackData;
  }
}
