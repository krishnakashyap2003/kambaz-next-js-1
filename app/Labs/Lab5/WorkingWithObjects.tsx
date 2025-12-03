"use client";
import React, { useState } from "react";
import { HTTP_SERVER } from "../../lib/api-config";

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    title: "NodeJS Assignment",
    score: 0,
    completed: false,
  });

  const [module, setModule] = useState({
    name: "Introduction to Node.js",
    description: "Learn the basics of Node.js and Express",
  });

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary" href={`${HTTP_SERVER}/lab5/assignment`}>Get Assignment</a>
      <hr />
      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary" href={`${HTTP_SERVER}/lab5/assignment/title`}>Get Title</a>
      <hr />
      <h4>Update Assignment Title</h4>
      <input className="form-control w-50" value={assignment.title} onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />
      <a className="btn btn-success mt-2" href={`${HTTP_SERVER}/lab5/assignment/title/${assignment.title}`}>Update Title</a>
      <hr />
      <h4>Update Assignment Score</h4>
      <input type="number" className="form-control w-25" value={assignment.score} onChange={(e) => setAssignment({ ...assignment, score: Number(e.target.value) })} />
      <a className="btn btn-warning mt-2" href={`${HTTP_SERVER}/lab5/assignment/score/${assignment.score}`}>Update Score</a>
      <hr />
      <h4>Update Assignment Completed</h4>
      <input type="checkbox" checked={assignment.completed} onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })} />
      <a className="btn btn-info mt-2 ms-2" href={`${HTTP_SERVER}/lab5/assignment/completed/${assignment.completed}`}>Update Completed</a>
      <hr />
      <h3>Working With Module Object</h3>
      <h4>Retrieving Module</h4>
      <a id="wd-retrieve-module" className="btn btn-primary" href={`${HTTP_SERVER}/lab5/module`}>Get Module</a>
      <hr />
      <h4>Retrieving Module Name</h4>
      <a id="wd-retrieve-module-name" className="btn btn-primary" href={`${HTTP_SERVER}/lab5/module/name`}>Get Module Name</a>
      <hr />
      <h4>Update Module Name</h4>
      <input className="form-control w-50" value={module.name} onChange={(e) => setModule({ ...module, name: e.target.value })} />
      <a className="btn btn-success mt-2" href={`${HTTP_SERVER}/lab5/module/name/${module.name}`}>Update Module Name</a>
      <hr />
      <h4>Update Module Description</h4>
      <input className="form-control w-75" value={module.description} onChange={(e) => setModule({ ...module, description: e.target.value })} />
      <a className="btn btn-warning mt-2" href={`${HTTP_SERVER}/lab5/module/description/${module.description}`}>Update Module Description</a>
      <hr />
    </div>
  );
}