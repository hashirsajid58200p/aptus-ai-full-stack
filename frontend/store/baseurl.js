let baseurl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

if (typeof window !== "undefined") {
  // If running in browser on deployed domain (Vercel, custom domain, etc.):
  // Since frontend and backend are deployed together under Vercel Services,
  // always use same-origin "/api/v1" so domain renames or external env variables never cause CORS or 404 errors.
  if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    baseurl = "/api/v1";
  }
}

export default baseurl;
