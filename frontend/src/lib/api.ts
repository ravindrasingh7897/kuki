// Utility to get the API base URL from env or fallback to relative
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function apiUrl(path: string) {
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
}
