export async function summarizeWebsite(url) {
  const res = await fetch("http://localhost:5000/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to summarize");
  }

  return data.summary;
}
