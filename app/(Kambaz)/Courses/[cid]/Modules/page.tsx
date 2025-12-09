"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import * as coursesClient from "@/app/(Kambaz)/Courses/client";
import { addModule, deleteModule, setModules, updateModule as updateModuleAction } from "./reducer";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import ModuleEditor from "./ModuleEditor";
import { BsGripVertical } from "react-icons/bs";
import "./index.css";

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const modules = useSelector((state: any) => state.modulesReducer || []);
  const [moduleName, setModuleName] = useState("");
  const [course, setCourse] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [editingModule, setEditingModule] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Expand all modules by default
  useEffect(() => {
    if (modules.length > 0) {
      const allModuleIds = new Set<string>(modules.map((m: any) => m._id));
      setExpandedModules(allModuleIds);
    }
  }, [modules]);

  const isFacultyOrAdmin = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const loadCourse = async () => {
    try {
      const courseData = await coursesClient.findCourseById(cid as string);
      setCourse(courseData);
    } catch (error) {
      console.error("Error loading course:", error);
    }
  };

  const loadModules = async () => {
    try {
      const list = await coursesClient.findModulesForCourse(cid as string);
      // Normalize modules array (handle Mongoose documents)
      const normalizedList = (list || []).map((m: any) => 
        m?.toObject ? m.toObject() : m
      );
      dispatch(setModules(normalizedList));
    } catch (error) {
      console.error("Error loading modules:", error);
      dispatch(setModules([]));
    }
  };

  useEffect(() => {
    loadCourse();
    loadModules();
  }, [cid]);


  const remove = async (mid: string) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      await coursesClient.deleteModule(mid);
      dispatch(deleteModule(mid));
    }
  };

  const editModule = (moduleId: string) => {
    const safeModules = Array.isArray(modules) ? modules : [];
    const module = safeModules.find((m: any) => m._id === moduleId);
    if (module) {
      setEditingModule(module);
      setModuleName(module.name);
      setShowEditModal(true);
    }
  };

  const handleUpdateModule = async () => {
    if (!moduleName.trim() || !editingModule) return;

    const updated = await coursesClient.updateModule({
      ...editingModule,
      name: moduleName,
    });

    dispatch(updateModuleAction(updated));
    setModuleName("");
    setEditingModule(null);
    setShowEditModal(false);
  };

  const handleCreateModule = async () => {
    if (!moduleName.trim()) return;

    try {
      const moduleResponse = await coursesClient.createModuleForCourse(cid as string, {
        name: moduleName,
      });

      // Normalize the module response (handle Mongoose documents or plain objects)
      const module = moduleResponse?.toObject ? moduleResponse.toObject() : moduleResponse;
      
      // Ensure module has required structure
      const normalizedModule = {
        _id: module?._id || module?.id,
        name: module?.name || moduleName,
        course: module?.course || cid,
        lessons: module?.lessons || [],
        ...module
      };

      // Add module to Redux state immediately for instant UI update
      if (normalizedModule._id) {
        dispatch(addModule(normalizedModule));
        // Add new module to expanded set so it's visible
        setExpandedModules((prev) => new Set([...prev, normalizedModule._id]));
      }

      // Also reload modules to ensure we have the latest data from server
      await loadModules();
      
      setModuleName("");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error creating module:", error);
      // Still close modal even on error
      setModuleName("");
      setShowEditModal(false);
    }
  };

  const handleAddModuleClick = () => {
    setEditingModule(null);
    setModuleName("");
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingModule(null);
    setModuleName("");
  };

  const handleModalSubmit = () => {
    if (editingModule) {
      handleUpdateModule();
    } else {
      handleCreateModule();
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const safeModules = Array.isArray(modules) ? modules : [];

  return (
    <div className="wd-modules-page">
      {/* Header */}
      <h2 className="text-danger mb-3">
        {course?.name || "Course"} &gt; Modules
      </h2>

      {/* Action Buttons */}
      {isFacultyOrAdmin && (
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={handleAddModuleClick}
          isFaculty={isFacultyOrAdmin}
        />
      )}

      {/* Edit/Add Module Modal */}
      {isFacultyOrAdmin && (
        <ModuleEditor
          show={showEditModal}
          handleClose={handleCloseModal}
          dialogTitle={editingModule ? "Edit Module" : "Add Module"}
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={handleModalSubmit}
        />
      )}

      {/* Modules List */}
      <div className="wd-modules-list">
        {safeModules.length === 0 ? (
          <div className="text-center text-muted py-5">
            No modules yet. Click "+ Module" to add one.
          </div>
        ) : (
          safeModules.map((m: any) => (
            <div key={m._id || Math.random()} className="wd-module-item">
            {/* Module Header */}
            <div className="wd-module-header d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center flex-grow-1">
                {/* Draggable dots */}
                <div className="wd-drag-handle me-2">
                  <BsGripVertical className="text-muted" style={{ fontSize: "1.5rem" }} />
                </div>
                {/* Module name - clickable to expand/collapse */}
                <div 
                  className="wd-module-name flex-grow-1"
                  onClick={() => toggleModule(m._id)}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{m.name}</strong>
                </div>
              </div>

              {/* Module action buttons */}
              {isFacultyOrAdmin && (
                <ModuleControlButtons
                  moduleId={m._id}
                  deleteModule={remove}
                  editModule={editModule}
                />
              )}
            </div>

            {/* Sub-modules (Lessons) */}
            {expandedModules.has(m._id) && m.lessons && Array.isArray(m.lessons) && m.lessons.length > 0 && (
              <div className="wd-lessons-list">
                {m.lessons.map((lesson: any, index: number) => (
                  <div key={lesson._id || lesson.id || index} className="wd-lesson-item d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1">
                      {/* Draggable dots */}
                      <div className="wd-drag-handle me-2 ms-4">
                        <BsGripVertical className="text-muted" style={{ fontSize: "1.5rem" }} />
                      </div>
                      {/* Lesson name */}
                      <div className="wd-lesson-name">
                        {lesson.name}
                      </div>
                    </div>

                    {/* Lesson action buttons */}
                    <div className="wd-lesson-controls">
                      <LessonControlButtons />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          ))
        )}
      </div>
    </div>
  );
}
