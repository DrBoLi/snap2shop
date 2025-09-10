import { Outlet } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import React from "react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export default function App() {
  return (
    <AppProvider isEmbeddedApp apiKey={process.env.SHOPIFY_API_KEY!}>
      <NavMenu>
        <a href="/" rel="home">
          Home
        </a>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify app bridge boundary
export const ErrorBoundary = boundary.error;