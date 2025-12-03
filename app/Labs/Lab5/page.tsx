import PathParameters from "./PathParameters";
import EnvironmentVariables from "./EnvironmentVariables"; 
import QueryParameters from "./QueryParameters";
import WorkingWithObjects from "./WorkingWithObjects";
import WorkingWithArrays from "./WorkingWithArrays";
import HttpClient from "./HttpClient";
import WorkingWithArraysAsynchronously from "./WorkingWithArraysAsynchronously";
import WorkingWithObjectsAsynchronously from "./WorkingWithObjectsAsynchronously";

import { HTTP_SERVER } from "../../lib/api-config";
export default function Lab5() {

  return (
    <div id="wd-lab5">
      <h2>Lab 5</h2>
      <div className="list-group">
        <a
          href={`${HTTP_SERVER}/lab5/welcome`}
          className="list-group-item"
        >
          Welcome
        </a>
      </div>
      <hr />
      <EnvironmentVariables />
      <PathParameters />
      <QueryParameters />
      <WorkingWithObjects />
      <WorkingWithArrays />
      <HttpClient />
    <WorkingWithObjectsAsynchronously />
      <WorkingWithArraysAsynchronously />

    </div>
  );
}
