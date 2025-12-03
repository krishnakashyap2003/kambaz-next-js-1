/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { HTTP_SERVER } from "../lib/api-config";

const axiosWithCredentials = axios.create({ withCredentials: true });


export const COURSES_API = `${HTTP_SERVER}/api/courses`;
export const USERS_API = `${HTTP_SERVER}/api/users`;
export const MODULES_API = `${HTTP_SERVER}/api/modules`;
export const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

/* ---------------- COURSES ---------------- */

export const fetchAllCourses = async () => {
  const { data } = await axiosWithCredentials.get(COURSES_API);
  return data;
};

export const updateCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.put(
    `${COURSES_API}/${course._id}`,
    course
  );
  return data;
};

export const deleteCourse = async (courseId: string) => {
  await axiosWithCredentials.delete(`${COURSES_API}/${courseId}`);
};

export const enroll = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses/${courseId}`
  );
  return data;
};

export const unenroll = async (courseId: string) => {
  await axiosWithCredentials.delete(`${USERS_API}/current/courses/${courseId}`);
};

export const findAllCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}`
  );
  return data;
};

export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/users`
  );
  return data;
};

/* ---------------- MODULES ---------------- */

export const findModulesForCourse = async (cid: string) => {
  const { data } = await axiosWithCredentials.get(`${COURSES_API}/${cid}/modules`);
  return data;
};

export const createModuleForCourse = async (cid: string, module: any) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${cid}/modules`,
    module
  );
  return data;
};

export const updateModule = async (module: any) => {
  const { data } = await axiosWithCredentials.put(
    `${MODULES_API}/${module._id}`,
    module
  );
  return data;
};

export const deleteModule = async (moduleId: string) => {
  await axiosWithCredentials.delete(`${MODULES_API}/${moduleId}`);
};

/* ---------------- ASSIGNMENTS ---------------- */

export const findAssignmentsForCourse = async (cid: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${cid}/assignments`
  );
  return data;
};

export const createAssignmentForCourse = async (cid: string, assignment: any) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${cid}/assignments`,
    assignment
  );
  return data;
};

export const updateAssignment = async (assignment: any) => {
  const { data } = await axiosWithCredentials.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment
  );
  return data;
};

export const deleteAssignment = async (assignmentId: string) => {
  await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
};
