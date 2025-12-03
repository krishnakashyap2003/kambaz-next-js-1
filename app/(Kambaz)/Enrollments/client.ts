import axios from "axios";
import { HTTP_SERVER } from "../lib/api-config";
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;

export const fetchAllEnrollments = async () => {
  const { data } = await axios.get(ENROLLMENTS_API);
  return data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const { data } = await axios.get(`${ENROLLMENTS_API}/user/${userId}`);
  return data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${ENROLLMENTS_API}/course/${courseId}`);
  return data;
};