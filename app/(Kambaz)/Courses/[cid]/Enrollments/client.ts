import axios from "axios";
import { Enrollment } from "../../../types";
import { HTTP_SERVER } from "../../../lib/api-config";

const axiosWithCredentials = axios.create({ withCredentials: true });
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;
const USERS_API = `${HTTP_SERVER}/api/users`;

export const findEnrollmentsForUser = async (userId: string): Promise<Enrollment[]> => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${userId}/enrollments`);
  return response.data;
};

export const findEnrollmentsForCourse = async (courseId: string): Promise<Enrollment[]> => {
  const response = await axiosWithCredentials.get(`${ENROLLMENTS_API}/course/${courseId}`);
  return response.data;
};

export const enrollInCourse = async (userId: string, courseId: string): Promise<Enrollment> => {
  const response = await axiosWithCredentials.post(`${ENROLLMENTS_API}`, {
    user: userId,
    course: courseId,
  });
  return response.data;
};

export const unenrollFromCourse = async (userId: string, courseId: string): Promise<void> => {
  const response = await axiosWithCredentials.delete(
    `${ENROLLMENTS_API}/user/${userId}/course/${courseId}`
  );
  return response.data;
};