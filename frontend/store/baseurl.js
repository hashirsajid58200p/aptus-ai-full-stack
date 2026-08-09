let baseurl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

if (typeof window !== "undefined") {
  // If running in browser on live Vercel domain, ignore any localhost NEXT_PUBLIC_API_URL setting
  if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    if (!baseurl || baseurl.includes("localhost") || baseurl.includes("127.0.0.1")) {
      baseurl = "/api/v1";
    }
  }
}

export default baseurl;
