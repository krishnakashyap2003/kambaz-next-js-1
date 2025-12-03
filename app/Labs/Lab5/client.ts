import axios from "axios";
import { HTTP_SERVER } from "../../lib/api-config";

// Helper function to get API URL from path
// Usage: getApiUrl('/lab5/assignment') => 'https://server.com/lab5/assignment'
export const getApiUrl = (path: string): string => {
  // Remove leading slash if present, then add it back to ensure consistency
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${HTTP_SERVER}${cleanPath}`;
};

// Use environment variables if set, otherwise construct from base URL
const ASSIGNMENT_API = process.env.NEXT_PUBLIC_ASSIGNMENT_API || getApiUrl('/lab5/assignment');
const TODOS_API = process.env.NEXT_PUBLIC_TODOS_API || getApiUrl('/lab5/todos');


export const fetchWelcomeMessage = async () => {
  const response = await axios.get(getApiUrl('/lab5/welcome'));
  return response.data;
};


export const fetchAssignment = async () => {
  const response = await axios.get(ASSIGNMENT_API);
  return response.data;
};

export const updateTitle = async (title: string) => {
  const response = await axios.get(getApiUrl(`/lab5/assignment/title/${encodeURIComponent(title)}`));
  return response.data;
};


export const fetchTodos = async () => {
  const response = await axios.get(TODOS_API);
  return response.data;
};

export const createNewTodo = async () => {
  const response = await axios.get(getApiUrl('/lab5/todos/create'));
  return response.data;
};

export const postNewTodo = async (todo: any) => {
  const response = await axios.post(TODOS_API, todo);
  return response.data;
};

export const removeTodo = async (todo: any) => {
  const response = await axios.get(getApiUrl(`/lab5/todos/${todo.id}/delete`));
  return response.data;
};

export const deleteTodo = async (todo: any) => {
  const response = await axios.delete(getApiUrl(`/lab5/todos/${todo.id}`));
  return response.data;
};

export const updateTodo = async (todo: any) => {
  const response = await axios.put(getApiUrl(`/lab5/todos/${todo.id}`), todo);
  return response.data;
};
