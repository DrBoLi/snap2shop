var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { jsxDEV } from "react/jsx-dev-runtime";
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  responseHeaders.delete("X-Frame-Options"), responseHeaders.delete("Content-Security-Policy");
  let markup = renderToString(
    /* @__PURE__ */ jsxDEV(RemixServer, { context: remixContext, url: request.url }, void 0, !1, {
      fileName: "app/entry.server.tsx",
      lineNumber: 17,
      columnNumber: 5
    }, this)
  );
  return responseHeaders.set("Content-Type", "text/html"), new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader
});
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
var loader = async ({ request }) => json({}), links = () => [
  { rel: "preconnect", href: "https://cdn.shopify.com/" },
  {
    rel: "stylesheet",
    href: "https://cdn.shopify.com/static/fonts/inter/v2/styles.css"
  }
];
function App() {
  return /* @__PURE__ */ jsxDEV2("html", { lang: "en", children: [
    /* @__PURE__ */ jsxDEV2("head", { children: [
      /* @__PURE__ */ jsxDEV2("meta", { charSet: "utf-8" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 31,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2("link", { rel: "preconnect", href: "https://cdn.shopify.com/" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 33,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(
        "link",
        {
          rel: "stylesheet",
          href: "https://cdn.shopify.com/static/fonts/inter/v2/styles.css"
        },
        void 0,
        !1,
        {
          fileName: "app/root.tsx",
          lineNumber: 34,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV2(Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 38,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 39,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 30,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV2("body", { children: [
      /* @__PURE__ */ jsxDEV2(
        AppProvider,
        {
          i18n: {
            Polaris: {
              Avatar: {
                label: "Avatar",
                labelWithInitials: "Avatar with initials {initials}"
              },
              ContextualSaveBar: {
                save: "Save",
                discard: "Discard"
              },
              TextField: {
                characterCount: "{count} characters"
              },
              TopBar: {
                toggleMenuLabel: "Toggle menu",
                SearchField: {
                  clearButtonLabel: "Clear",
                  search: "Search"
                }
              }
            }
          },
          features: {
            newDesignLanguage: !0
          },
          children: /* @__PURE__ */ jsxDEV2(Outlet, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 69,
            columnNumber: 11
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/root.tsx",
          lineNumber: 42,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV2(ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 71,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 72,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 73,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 29,
    columnNumber: 5
  }, this);
}

// app/routes/webhooks.tsx
var webhooks_exports = {};
__export(webhooks_exports, {
  action: () => action
});

// app/shopify.server.ts
import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";

// app/db.server.ts
import { PrismaClient } from "@prisma/client";
var prisma;
global.__db__ || (global.__db__ = new PrismaClient()), prisma = global.__db__, prisma.$connect();
var db_server_default = prisma;

// app/shopify.server.ts
var shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(",") || ["read_products"],
  appUrl: process.env.SHOPIFY_APP_URL || process.env.APP_URL,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(db_server_default),
  distribution: AppDistribution.AppStore,
  isEmbeddedApp: !0,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks"
    }
  },
  hooks: {
    afterAuth: async ({ session }) => {
      try {
        let response = await fetch(`${process.env.BACKEND_URL}/shopify/install`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            shop: session.shop,
            access_token: session.accessToken
          })
        });
        response.ok || console.error("Failed to register shop with backend:", response.statusText);
      } catch (error) {
        console.error("Error registering shop with backend:", error);
      }
    }
  },
  future: {
    v3_webhookAdminContext: !0,
    v3_authenticatePublic: !0
  },
  ...process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}
});
var addDocumentResponseHeaders = shopify.addDocumentResponseHeaders, authenticate = shopify.authenticate, unauthenticated = shopify.unauthenticated, login = shopify.login, registerWebhooks = shopify.registerWebhooks, sessionStorage = shopify.sessionStorage;

// app/routes/webhooks.tsx
var action = async ({ request }) => {
  let { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );
  if (!admin)
    throw new Response();
  switch (topic) {
    case "APP_UNINSTALLED":
      session && console.log(`App uninstalled for shop: ${shop}`);
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }
  throw new Response();
};

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  action: () => action2,
  default: () => Index,
  loader: () => loader2
});
import { json as json2 } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  InlineStack,
  Badge,
  ProgressBar,
  Banner,
  EmptyState,
  Spinner
} from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { Fragment, jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
var loader2 = async ({ request }) => {
  let { admin, session } = await authenticate.admin(request), shopDomain = session.shop, indexStatus = null;
  try {
    let response = await fetch(`${process.env.BACKEND_URL}/admin/index/status/${shopDomain}`);
    response.ok && (indexStatus = await response.json());
  } catch (error) {
    console.error("Failed to fetch index status:", error);
  }
  return json2({
    shopDomain,
    indexStatus,
    backendUrl: process.env.BACKEND_URL || "http://localhost:8000"
  });
}, action2 = async ({ request }) => {
  let { session } = await authenticate.admin(request);
  if ((await request.formData()).get("action") === "start_indexing")
    try {
      let indexFormData = new FormData();
      indexFormData.append("shop_domain", session.shop);
      let response = await fetch(`${process.env.BACKEND_URL}/admin/index`, {
        method: "POST",
        body: indexFormData
      });
      if (response.ok) {
        let result = await response.json();
        return json2({ success: !0, jobId: result.job_id });
      } else
        return json2({ success: !1, error: "Failed to start indexing" });
    } catch (error) {
      return json2({ success: !1, error: error.message });
    }
  return json2({ success: !1, error: "Unknown action" });
};
function Index() {
  let { shopDomain, indexStatus: initialStatus, backendUrl } = useLoaderData(), submit = useSubmit(), [indexStatus, setIndexStatus] = useState(initialStatus), [isPolling, setIsPolling] = useState(!1), fetchStatus = useCallback(async () => {
    try {
      let response = await fetch(`${backendUrl}/admin/index/status/${shopDomain}`);
      if (response.ok) {
        let data = await response.json();
        return setIndexStatus(data), data;
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
    return null;
  }, [backendUrl, shopDomain]), startIndexing = () => {
    let formData = new FormData();
    formData.append("action", "start_indexing"), submit(formData, { method: "post" }), setIsPolling(!0);
  };
  useEffect(() => {
    let interval;
    return (isPolling || indexStatus?.status === "running" || indexStatus?.status === "queued") && (interval = setInterval(async () => {
      let status = await fetchStatus();
      status && (status.status === "done" || status.status === "error") && setIsPolling(!1);
    }, 3e3)), () => {
      interval && clearInterval(interval);
    };
  }, [isPolling, indexStatus?.status, fetchStatus]);
  let getStatusBadge = (status) => {
    let statusMap = {
      queued: { tone: "info", children: "Queued" },
      running: { tone: "attention", children: "Running" },
      done: { tone: "success", children: "Completed" },
      error: { tone: "critical", children: "Error" },
      no_jobs: { tone: "subdued", children: "Not Started" }
    }, config = statusMap[status] || statusMap.no_jobs;
    return /* @__PURE__ */ jsxDEV3(Badge, { tone: config.tone, children: config.children }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 128,
      columnNumber: 12
    }, this);
  }, getProgressPercentage = () => !indexStatus || indexStatus.total === 0 ? 0 : Math.round(indexStatus.processed / indexStatus.total * 100);
  return /* @__PURE__ */ jsxDEV3(Page, { title: "Snap2Shop", subtitle: "Manage your visual search functionality", children: /* @__PURE__ */ jsxDEV3(Layout, { children: [
    /* @__PURE__ */ jsxDEV3(Layout.Section, { children: /* @__PURE__ */ jsxDEV3(Card, { children: /* @__PURE__ */ jsxDEV3(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsxDEV3(InlineStack, { align: "space-between", children: [
        /* @__PURE__ */ jsxDEV3(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsxDEV3(Text, { variant: "headingMd", as: "h2", children: "Product Indexing" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 144,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", tone: "subdued", children: "Index your products for visual search" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 147,
            columnNumber: 19
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 143,
          columnNumber: 17
        }, this),
        getStatusBadge(indexStatus?.status || "no_jobs")
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 142,
        columnNumber: 15
      }, this),
      indexStatus && indexStatus.status !== "no_jobs" && /* @__PURE__ */ jsxDEV3(BlockStack, { gap: "200", children: [
        indexStatus.status === "running" && /* @__PURE__ */ jsxDEV3(Fragment, { children: [
          /* @__PURE__ */ jsxDEV3(ProgressBar, { progress: getProgressPercentage(), size: "medium" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 158,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: [
            "Processing ",
            indexStatus.processed,
            " of ",
            indexStatus.total,
            " products"
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 159,
            columnNumber: 23
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 157,
          columnNumber: 21
        }, this),
        indexStatus.product_count > 0 && /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: [
          /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", fontWeight: "bold", as: "span", children: indexStatus.product_count }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 167,
            columnNumber: 23
          }, this),
          " ",
          "products indexed"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 166,
          columnNumber: 21
        }, this),
        indexStatus.started_at && /* @__PURE__ */ jsxDEV3(Text, { variant: "bodySm", tone: "subdued", children: [
          "Started: ",
          new Date(indexStatus.started_at).toLocaleString()
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 175,
          columnNumber: 21
        }, this),
        indexStatus.finished_at && /* @__PURE__ */ jsxDEV3(Text, { variant: "bodySm", tone: "subdued", children: [
          "Finished: ",
          new Date(indexStatus.finished_at).toLocaleString()
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 181,
          columnNumber: 21
        }, this),
        indexStatus.error && /* @__PURE__ */ jsxDEV3(Banner, { tone: "critical", children: /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: indexStatus.error }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 188,
          columnNumber: 23
        }, this) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 187,
          columnNumber: 21
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 155,
        columnNumber: 17
      }, this),
      (!indexStatus || indexStatus.status === "no_jobs" || indexStatus.status === "done") && /* @__PURE__ */ jsxDEV3(
        EmptyState,
        {
          heading: indexStatus?.product_count > 0 ? "Indexing Complete" : "Get Started",
          action: {
            content: indexStatus?.product_count > 0 ? "Re-index Products" : "Index Products",
            onAction: startIndexing
          },
          image: "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg",
          children: /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: indexStatus?.product_count > 0 ? "Your products are indexed and ready for visual search." : "Index your product catalog to enable visual search functionality." }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 206,
            columnNumber: 19
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 197,
          columnNumber: 17
        },
        this
      ),
      (isPolling || indexStatus?.status === "running" || indexStatus?.status === "queued") && /* @__PURE__ */ jsxDEV3(InlineStack, { align: "center", gap: "200", children: [
        /* @__PURE__ */ jsxDEV3(Spinner, { size: "small" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 216,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: "Indexing in progress..." }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 217,
          columnNumber: 19
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 215,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 141,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 140,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 139,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV3(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsxDEV3(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsxDEV3(Card, { children: /* @__PURE__ */ jsxDEV3(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsxDEV3(Text, { variant: "headingMd", as: "h3", children: "Quick Stats" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 228,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV3(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsxDEV3(InlineStack, { align: "space-between", children: [
            /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: "Products Indexed" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 233,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", fontWeight: "bold", children: indexStatus?.product_count || 0 }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 234,
              columnNumber: 21
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 232,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV3(InlineStack, { align: "space-between", children: [
            /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: "Status" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 239,
              columnNumber: 21
            }, this),
            getStatusBadge(indexStatus?.status || "no_jobs")
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 238,
            columnNumber: 19
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 231,
          columnNumber: 17
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 227,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 226,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV3(Card, { children: /* @__PURE__ */ jsxDEV3(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsxDEV3(Text, { variant: "headingMd", as: "h3", children: "Phase 0 Features" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 248,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV3(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: "\u2705 Manual product indexing" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 252,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: "\u2705 Visual similarity search" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 253,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: "\u2705 Theme app embed widget" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 254,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: "\u23F3 Auto-sync (Phase 1)" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 255,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV3(Text, { variant: "bodyMd", children: "\u23F3 Advanced analytics (Phase 1)" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 256,
            columnNumber: 19
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 251,
          columnNumber: 17
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 247,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 246,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 225,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 224,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 138,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 137,
    columnNumber: 5
  }, this);
}

// app/routes/auth.$.tsx
var auth_exports = {};
__export(auth_exports, {
  loader: () => loader3
});
var loader3 = async ({ request }) => (await authenticate.admin(request), null);

// app/routes/debug.tsx
var debug_exports = {};
__export(debug_exports, {
  default: () => Debug,
  loader: () => loader4
});
import { json as json3 } from "@remix-run/node";
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
var loader4 = async () => json3({
  status: "ok",
  message: "Debug route working",
  timestamp: (/* @__PURE__ */ new Date()).toISOString(),
  env: {
    NODE_ENV: "development",
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? "SET" : "MISSING",
    SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
    BACKEND_URL: process.env.BACKEND_URL
  }
});
function Debug() {
  return /* @__PURE__ */ jsxDEV4("div", { style: { padding: "20px", fontFamily: "monospace" }, children: [
    /* @__PURE__ */ jsxDEV4("h1", { children: "Debug Page" }, void 0, !1, {
      fileName: "app/routes/debug.tsx",
      lineNumber: 21,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4("p", { children: "If you can see this, the basic routing is working." }, void 0, !1, {
      fileName: "app/routes/debug.tsx",
      lineNumber: 22,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4("p", { children: "Check the JSON response by visiting /debug with Accept: application/json" }, void 0, !1, {
      fileName: "app/routes/debug.tsx",
      lineNumber: 23,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/debug.tsx",
    lineNumber: 20,
    columnNumber: 5
  }, this);
}

// app/routes/app.tsx
var app_exports = {};
__export(app_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App2,
  links: () => links2
});
import { Outlet as Outlet2 } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider as AppProvider2 } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";

// ../node_modules/@shopify/polaris/build/esm/styles.css
var styles_default = "/build/_assets/styles-M6EFPFNU.css";

// app/routes/app.tsx
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
var links2 = () => [{ rel: "stylesheet", href: styles_default }];
function App2() {
  return /* @__PURE__ */ jsxDEV5(AppProvider2, { isEmbeddedApp: !0, apiKey: process.env.SHOPIFY_API_KEY, children: [
    /* @__PURE__ */ jsxDEV5(NavMenu, { children: /* @__PURE__ */ jsxDEV5("a", { href: "/", rel: "home", children: "Home" }, void 0, !1, {
      fileName: "app/routes/app.tsx",
      lineNumber: 14,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/app.tsx",
      lineNumber: 13,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV5(Outlet2, {}, void 0, !1, {
      fileName: "app/routes/app.tsx",
      lineNumber: 18,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/app.tsx",
    lineNumber: 12,
    columnNumber: 5
  }, this);
}
var ErrorBoundary = boundary.error;

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-FGJC4WL4.js", imports: ["/build/_shared/chunk-GBR2LDP2.js", "/build/_shared/chunk-LIJKWBJM.js", "/build/_shared/chunk-CWUZT7IQ.js", "/build/_shared/chunk-G4EA6I3U.js", "/build/_shared/chunk-TLBAXOHZ.js", "/build/_shared/chunk-CBDF6H27.js", "/build/_shared/chunk-G4YTFA6Y.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-2WSICD6F.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-CDI6FIIY.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-EH5ZFX4M.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app": { id: "routes/app", parentId: "root", path: "app", index: void 0, caseSensitive: void 0, module: "/build/routes/app-UTQW3YVB.js", imports: ["/build/_shared/chunk-CZNGAJO4.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !0 }, "routes/auth.$": { id: "routes/auth.$", parentId: "root", path: "auth/*", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.$-Z6LPBAD4.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/debug": { id: "routes/debug", parentId: "root", path: "debug", index: void 0, caseSensitive: void 0, module: "/build/routes/debug-5XYTETQ2.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/webhooks": { id: "routes/webhooks", parentId: "root", path: "webhooks", index: void 0, caseSensitive: void 0, module: "/build/routes/webhooks-YCEDH7MD.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "adf17ddf", hmr: { runtime: "/build/_shared/chunk-G4EA6I3U.js", timestamp: 1757513347769 }, url: "/build/manifest-ADF17DDF.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "development", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/webhooks": {
    id: "routes/webhooks",
    parentId: "root",
    path: "webhooks",
    index: void 0,
    caseSensitive: void 0,
    module: webhooks_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  "routes/debug": {
    id: "routes/debug",
    parentId: "root",
    path: "debug",
    index: void 0,
    caseSensitive: void 0,
    module: debug_exports
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: app_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map
