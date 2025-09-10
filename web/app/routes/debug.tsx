import { json } from "@remix-run/node";
import React from "react";

export const loader = async () => {
  return json({
    status: "ok",
    message: "Debug route working",
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? "SET" : "MISSING",
      SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
      BACKEND_URL: process.env.BACKEND_URL,
    }
  });
};

export default function Debug() {
  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Debug Page</h1>
      <p>If you can see this, the basic routing is working.</p>
      <p>Check the JSON response by visiting /debug with Accept: application/json</p>
    </div>
  );
}