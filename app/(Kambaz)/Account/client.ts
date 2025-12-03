/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

// Determine API server URL at runtime
// Priority: 1. Environment variable, 2. Auto-detect from hostname, 3. Default to localhost
const getApiServer = () => {
  // If environment variable is set, use it
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE;
  }
  
  // Auto-detect: if running on Vercel (production), use Render server
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If on Vercel domain (not localhost), use Render server
    if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
      return 'https://kambaz-node-server-app-w7cz.onrender.com';
    }
  }
  
  // Also check process.env for Vercel's environment (server-side)
  if (typeof process !== 'undefined' && process.env.VERCEL_URL) {
    return 'https://kambaz-node-server-app-w7cz.onrender.com';
  }
  
  // Default to localhost for local development
  return 'http://localhost:4000';
};

// Use a getter function so it's evaluated at runtime, not build time
export const getHttpServer = () => getApiServer();
export const HTTP_SERVER = getApiServer(); // For backward compatibility, but will be re-evaluated

// Log API URL and warn if using localhost in production
if (typeof window !== 'undefined') {
  const currentServer = getApiServer(); // Get fresh value at runtime
  console.log("🔧 API Base URL:", currentServer);
  console.log("🔧 Environment Variable NEXT_PUBLIC_API_BASE:", process.env.NEXT_PUBLIC_API_BASE || "NOT SET");
  console.log("🔧 Current Hostname:", window.location.hostname);
  if (currentServer.includes('localhost') && window.location.hostname !== 'localhost') {
    console.error("❌ ERROR: Using localhost API URL in production! Set NEXT_PUBLIC_API_BASE in Vercel.");
  }
}

// Add request interceptor for debugging
axiosWithCredentials.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const currentServer = getApiServer();
      console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
      console.log("📤 Full URL:", config.baseURL || currentServer + config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosWithCredentials.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log("📥 API Response:", response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined') {
      console.error("❌ API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        isNetworkError: !error.response
      });
    }
    return Promise.reject(error);
  }
);

// Use getter function to get fresh API URL at runtime
export const getUsersApi = () => `${getApiServer()}/api/users`;
export const USERS_API = getUsersApi(); // For backward compatibility


export const signin = async (credentials: any) => {
  const response = await axiosWithCredentials.post(
    `${getUsersApi()}/signin`,
    credentials
  );
  return response.data;
};

export const signup = async (user: any) => {
  const response = await axiosWithCredentials.post(
    `${getUsersApi()}/signup`,
    user
  );
  return response.data;
};

export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    `${getUsersApi()}/${user._id}`,
    user
  );
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.post(`${getUsersApi()}/profile`);
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${getUsersApi()}/signout`);
  return response.data;
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(
    `${getUsersApi()}/current/courses`,
    course
  );
  return data;
};

export const findCoursesForUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(
    `${getUsersApi()}/${userId}/courses`
  );
  return response.data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${getUsersApi()}/current/courses`
  );
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${getUsersApi()}/${userId}/courses/${courseId}`
  );
  return response.data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(
    `${getUsersApi()}/${userId}/courses/${courseId}`
  );
  return response.data;
};

export const findAllUsers = async (role?: string, name?: string) => {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (name) params.append("name", name);
  const queryString = params.toString();
  const url = `${getUsersApi()}${queryString ? `?${queryString}` : ""}`;
  const response = await axiosWithCredentials.get(url);
  return response.data;
};

export const findUserById = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${getUsersApi()}/${userId}`);
  return response.data;
};

export const createUser = async (user: any) => {
  const response = await axiosWithCredentials.post(getUsersApi(), user);
  return response.data;
};

export const deleteUserById = async (userId: string) => {
  const response = await axiosWithCredentials.delete(`${getUsersApi()}/${userId}`);
  return response.data;
};