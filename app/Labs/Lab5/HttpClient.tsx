"use client";
import React, { useEffect, useState } from "react";
import * as client from "./client";
import { HTTP_SERVER, getApiServer } from "../../lib/api-config";

export default function HttpClient() {
  const [welcomeOnClick, setWelcomeOnClick] = useState("");
  const [welcomeOnLoad, setWelcomeOnLoad] = useState("");

  console.log("ENV TEST:", {
  HTTP_SERVER: getApiServer(),
  ASSIGNMENT_API: process.env.NEXT_PUBLIC_ASSIGNMENT_API,
  TODOS_API: process.env.NEXT_PUBLIC_TODOS_API,
});

  const fetchWelcomeOnClick = async () => {
    const message = await client.fetchWelcomeMessage();
    setWelcomeOnClick(message);
  };

  const fetchWelcomeOnLoad = async () => {
    const welcome = await client.fetchWelcomeMessage();
    setWelcomeOnLoad(welcome);
  };

  useEffect(() => {
    fetchWelcomeOnLoad();
  }, []);

  return (
    <div>
      <h3>HTTP Client</h3><hr />
      <h4>Requesting on Click</h4>
      <button className="btn btn-primary me-2" onClick={fetchWelcomeOnClick}>Fetch Welcome</button><br />
      Response from server: <b>{welcomeOnClick}</b>
      <hr />
      <h4>Requesting on Load</h4>
      Response from server: <b>{welcomeOnLoad}</b>
      <hr />
    </div>
  );
}