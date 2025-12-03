"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "@/app/(Kambaz)/Courses/client";

// ------------------------
//  Assignment Type
// ------------------------
interface Assignment {
  _id?: string;
  title: string;
  available: string;
  due: string;
  points: number;
}

export default function Assignments() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState<string>("");

  const isFacultyOrAdmin = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  // -----------------------------
  // LOAD ASSIGNMENTS FOR COURSE
  // -----------------------------
  const load = async () => {
    const list = await client.findAssignmentsForCourse(cid as string);
    setAssignments(list || []);
  };

  useEffect(() => {
    load();
  }, [cid]);

  // -----------------------------
  // CREATE ASSIGNMENT
  // -----------------------------
  const create = async () => {
    if (!title.trim()) return;

    const newA: Assignment = await client.createAssignmentForCourse(
      cid as string,
      {
        title,
        available: "May 6",
        due: "May 13",
        points: 100,
      }
    );

    setAssignments((prev: Assignment[]) => [...prev, newA]);
    setTitle("");
  };

  // -----------------------------
  // UPDATE ASSIGNMENT
  // -----------------------------
  const save = async (a: Assignment) => {
    const updated: Assignment = await client.updateAssignment(a);

    setAssignments((prev: Assignment[]) =>
      prev.map((x) => (x._id === updated._id ? updated : x))
    );
  };

  // -----------------------------
  // DELETE ASSIGNMENT
  // -----------------------------
  const remove = async (id: string) => {
    await client.deleteAssignment(id);

    setAssignments((prev: Assignment[]) =>
      prev.filter((x) => x._id !== id)
    );
  };

  // ----------------------------------
  // RENDER
  // ----------------------------------
  return (
    <div className="p-4">
      <h2>Assignments</h2>

      {isFacultyOrAdmin && (
        <>
          <input
            className="form-control mb-2"
            placeholder="New assignment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button className="btn btn-primary mb-3" onClick={create}>
            + Assignment
          </button>
        </>
      )}

      {assignments.map((a: Assignment) => (
        <div key={a._id} className="border p-3 mb-3">
          <h4>{a.title}</h4>
          <p>
            Available: {a.available} • Due: {a.due} • {a.points} pts
          </p>

          {isFacultyOrAdmin && (
            <>
              <button
                className="btn btn-warning me-2"
                onClick={() => save({ ...a, title: a.title + " (Updated)" })}
              >
                Edit
              </button>

              <button className="btn btn-danger" onClick={() => remove(a._id!)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
