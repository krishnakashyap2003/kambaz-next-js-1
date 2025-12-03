
export const getApiServer = (): string => {
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE;
  }
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
      return 'https://kambaz-node-server-app-1-1.onrender.com';
    }
  }
  
  if (typeof process !== 'undefined' && process.env.VERCEL_URL) {
    return 'https://kambaz-node-server-app-1-1.onrender.com';
  }
  
  return 'http://localhost:4000';
};

export const HTTP_SERVER = getApiServer();

