"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import * as coursesClient from "@/app/(Kambaz)/Courses/client";
import { addModule, deleteModule, setModules, updateModule } from "./reducer";

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const modules = useSelector((state: any) => state.modulesReducer || []);
  const [moduleName, setModuleName] = useState("");

  const isFacultyOrAdmin = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const loadModules = async () => {
    const list = await coursesClient.findModulesForCourse(cid as string);
    dispatch(setModules(list || []));
  };

  useEffect(() => {
    loadModules();
  }, [cid]);

  const create = async () => {
    if (!moduleName.trim()) return;

    const module = await coursesClient.createModuleForCourse(cid as string, {
      name: moduleName,
    });

    dispatch(addModule(module));
    setModuleName("");
  };

  const remove = async (mid: string) => {
    await coursesClient.deleteModule(mid);
    dispatch(deleteModule(mid));
  };

  const save = async (module: any) => {
    const updated = await coursesClient.updateModule(module);
    dispatch(updateModule(updated));
  };

  const safeModules = Array.isArray(modules) ? modules : [];

  return (
    <div className="p-4">
      <h2>Modules</h2>

      {isFacultyOrAdmin && (
        <>
          <input
            className="form-control mb-2"
            placeholder="New module"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
          />

          <button className="btn btn-primary mb-3" onClick={create}>
            + Add Module
          </button>
        </>
      )}

      <ul className="list-group">
        {safeModules.map((m: any) => (
          <li key={m._id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <strong>{m.name}</strong>

              {isFacultyOrAdmin && (
                <span>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => save({ ...m, name: m.name + " (Updated)" })}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => remove(m._id)}
                  >
                    Delete
                  </button>
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
