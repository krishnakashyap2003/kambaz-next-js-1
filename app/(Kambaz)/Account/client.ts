/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

// Log API URL in development and warn if using localhost in production
if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'development') {
    console.log("🔧 API Base URL:", HTTP_SERVER);
  } else if (HTTP_SERVER.includes('localhost') && window.location.hostname !== 'localhost') {
    console.warn("⚠️ WARNING: Using localhost API URL in production! Set NEXT_PUBLIC_API_BASE in Vercel.");
  }
}

// Add request interceptor for debugging
axiosWithCredentials.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
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

export const USERS_API = `${HTTP_SERVER}/api/users`;


export const signin = async (credentials: any) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/signin`,
    credentials
  );
  return response.data;
};

export const signup = async (user: any) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/signup`,
    user
  );
  return response.data;
};

export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course
  );
  return data;
};

export const findCoursesForUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(
    `${USERS_API}/${userId}/courses`
  );
  return response.data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/courses`
  );
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};
