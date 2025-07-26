export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}
