"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import * as userClient from "@/app/(Kambaz)/Account/client";
import * as coursesClient from "@/app/(Kambaz)/Courses/client";

export default function Dashboard() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [published, setPublished] = useState<any[]>([]);
  const [enrolled, setEnrolled] = useState<any[]>([]);
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);
  const [course, setCourse] = useState<any>({
    name: "",
    description: "",
    image: "/Images/reactjs.jpg",
  });

  const load = async () => {
    const all = await coursesClient.findAllCourses();
    setPublished(all || []);

    if (currentUser) {
      const mine = await userClient.findMyCourses();
      setEnrolled(mine || []);
    }
  };

  useEffect(() => {
    load();
  }, [currentUser]);

  const addCourse = async () => {
    if (!currentUser) return alert("You must sign in first");
    const newCourse = await userClient.createCourse(course);
    setPublished((p) => [...p, newCourse]);
    setCourse({ name: "", description: "", image: "/Images/reactjs.jpg" });
  };

  const updateCourse = async () => {
    if (!course._id) return alert("Select a course to edit.");
    const updated = await coursesClient.updateCourse(course);

    setPublished((p) => p.map((c) => (c._id === updated._id ? updated : c)));
    setCourse({ name: "", description: "", image: "/Images/reactjs.jpg" });
  };

  const deleteCourse = async (id: string) => {
    await coursesClient.deleteCourse(id);
    setPublished((p) => p.filter((x) => x._id !== id));
  };

  const enroll = async (courseId: string) => {
    if (!currentUser) return alert("Login required");
    try {
      await userClient.enrollIntoCourse(currentUser._id, courseId);
      const mine = await userClient.findMyCourses();
      setEnrolled(mine || []);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Failed to enroll in course. Please try again.");
    }
  };

  const unenroll = async (courseId: string) => {
    if (!currentUser) return alert("Login required");
    try {
      await userClient.unenrollFromCourse(currentUser._id, courseId);
      const mine = await userClient.findMyCourses();
      setEnrolled(mine || []);
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      alert("Failed to unenroll from course. Please try again.");
    }
  };

  const isEnrolled = (id: string) =>
    enrolled.some((c: any) => c && c._id === id);

  const normalizeImagePath = (imagePath: string | undefined): string => {
    if (!imagePath) return "/Images/reactjs.jpg";
    if (imagePath.startsWith("/images/")) {
      return imagePath.replace("/images/", "/Images/");
    }
    return imagePath;
  };

  const displayedCourses = showEnrolledOnly
    ? published.filter((c: any) => isEnrolled(c._id))
    : published;

  const toggleView = () => {
    setShowEnrolledOnly(!showEnrolledOnly);
  };

  const isFacultyOrAdmin = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  return (
    <div className="p-4">
      {isFacultyOrAdmin && (
        <>
          <h2>New Course</h2>

          <input
            placeholder="Name"
            className="form-control mb-2"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />

          <input
            placeholder="Description"
            className="form-control mb-2"
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />

          <button className="btn btn-primary me-2" onClick={addCourse}>
            Add
          </button>

          <button className="btn btn-warning" onClick={updateCourse}>
            Update
          </button>

          <hr />
        </>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>
          {showEnrolledOnly ? "Enrolled Courses" : "All Courses"} (
          {displayedCourses.length})
        </h2>
        <button
          className="btn"
          style={{ backgroundColor: "#0d6efd", color: "white" }}
          onClick={toggleView}
        >
          {showEnrolledOnly ? "Show All Courses" : "Show Enrolled Courses"}
        </button>
      </div>
      <div className="row">
        {displayedCourses.map((c: any) => (
          <div key={c._id} className="col-md-4 mb-4">
            <div className="card">
              <img 
                src={normalizeImagePath(c.image)} 
                className="card-img-top" 
                height={200}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/Images/reactjs.jpg";
                }}
              />
              <div className="card-body">
                <h5>{c.name}</h5>
                <p>{c.description}</p>

                <Link
                  href={`/Courses/${c._id}/Home`}
                  className="btn btn-primary me-2"
                >
                  Go
                </Link>

                {isEnrolled(c._id) ? (
                  <button
                    className="btn btn-danger me-2"
                    onClick={(e) => {
                      e.preventDefault();
                      unenroll(c._id);
                    }}
                  >
                    Unenroll
                  </button>
                ) : (
                  <button
                    className="btn btn-success me-2"
                    onClick={(e) => {
                      e.preventDefault();
                      enroll(c._id);
                    }}
                  >
                    Enroll
                  </button>
                )}

                {isFacultyOrAdmin && (
                  <>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => setCourse(c)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => deleteCourse(c._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
