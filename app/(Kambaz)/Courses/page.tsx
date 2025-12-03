"use client";

import { useEffect, useState } from "react";
import * as userClient from "@/app/(Kambaz)/Account/client";
import * as coursesClient from "@/app/(Kambaz)/Courses/client";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function CoursesPage() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    name: "",
    number: "",
    description: "",
    image: "/Images/reactjs.jpg",
  });

  const isFaculty = currentUser?.role === "FACULTY";

  const fetchCourses = async () => {
    const data = await coursesClient.fetchAllCourses();
    setCourses(data);
  };

  const addCourse = async () => {
    const newCourse = await userClient.createCourse(course)

    setCourses([...courses, newCourse]);

    // reset form
    setCourse({
      name: "",
      number: "",
      description: "",
      image: "/Images/reactjs.jpg"
    });
  };

  const updateCourse = async () => {
    await coursesClient.updateCourse(course);
    fetchCourses(); // refresh list
  };

  const deleteCourse = async (id: string) => {
    await coursesClient.deleteCourse(id);
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div id="wd-courses-page">
      <h2>Courses</h2>

      {/* Faculty only */}
      {isFaculty && (
        <div className="mb-4">
          <h4>Create / Edit Course</h4>

          <input
            className="form-control mb-2"
            placeholder="Name"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />

          <input
            className="form-control mb-2"
            placeholder="Number"
            value={course.number}
            onChange={(e) => setCourse({ ...course, number: e.target.value })}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />

          <button className="btn btn-success me-2" onClick={addCourse}>
            Add
          </button>
          <button className="btn btn-warning" onClick={updateCourse}>
            Update
          </button>
        </div>
      )}

      <h4>All Published Courses ({courses.length})</h4>
      <hr />

      <ul className="list-group">
        {courses.map((c) => (
          <li
            key={c._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <Link href={`/Courses/${c._id}/Home`} className="text-decoration-none">
              {c.name} — {c.number}
            </Link>

            {isFaculty && (
              <div>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => deleteCourse(c._id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => setCourse(c)}
                >
                  Edit
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
