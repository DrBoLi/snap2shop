import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Badge,
  Banner,
  BlockStack,
  Card,
  EmptyState,
  InlineStack,
  Layout,
  Page,
  ProgressBar,
  Spinner,
  Text
} from "/build/_shared/chunk-CDI6FIIY.js";
import {
  useLoaderData,
  useSubmit
} from "/build/_shared/chunk-LIJKWBJM.js";
import "/build/_shared/chunk-CWUZT7IQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-G4EA6I3U.js";
import "/build/_shared/chunk-TLBAXOHZ.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-CBDF6H27.js";
import {
  require_react
} from "/build/_shared/chunk-G4YTFA6Y.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:../shopify.server
var require_shopify = __commonJS({
  "empty-module:../shopify.server"(exports, module) {
    module.exports = {};
  }
});

// app/routes/_index.tsx
var import_node = __toESM(require_node(), 1);
var import_shopify = __toESM(require_shopify(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_index.tsx"
  );
  import.meta.hot.lastModified = "1757480521043.4695";
}
function Index() {
  _s();
  const {
    shopDomain,
    indexStatus: initialStatus,
    backendUrl
  } = useLoaderData();
  const submit = useSubmit();
  const [indexStatus, setIndexStatus] = (0, import_react2.useState)(initialStatus);
  const [isPolling, setIsPolling] = (0, import_react2.useState)(false);
  const fetchStatus = (0, import_react2.useCallback)(async () => {
    try {
      const response = await fetch(`${backendUrl}/admin/index/status/${shopDomain}`);
      if (response.ok) {
        const data = await response.json();
        setIndexStatus(data);
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
    return null;
  }, [backendUrl, shopDomain]);
  const startIndexing = () => {
    const formData = new FormData();
    formData.append("action", "start_indexing");
    submit(formData, {
      method: "post"
    });
    setIsPolling(true);
  };
  (0, import_react2.useEffect)(() => {
    let interval;
    if (isPolling || indexStatus?.status === "running" || indexStatus?.status === "queued") {
      interval = setInterval(async () => {
        const status = await fetchStatus();
        if (status && (status.status === "done" || status.status === "error")) {
          setIsPolling(false);
        }
      }, 3e3);
    }
    return () => {
      if (interval)
        clearInterval(interval);
    };
  }, [isPolling, indexStatus?.status, fetchStatus]);
  const getStatusBadge = (status) => {
    const statusMap = {
      queued: {
        tone: "info",
        children: "Queued"
      },
      running: {
        tone: "attention",
        children: "Running"
      },
      done: {
        tone: "success",
        children: "Completed"
      },
      error: {
        tone: "critical",
        children: "Error"
      },
      no_jobs: {
        tone: "subdued",
        children: "Not Started"
      }
    };
    const config = statusMap[status] || statusMap.no_jobs;
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, { tone: config.tone, children: config.children }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 164,
      columnNumber: 12
    }, this);
  };
  const getProgressPercentage = () => {
    if (!indexStatus || indexStatus.total === 0)
      return 0;
    return Math.round(indexStatus.processed / indexStatus.total * 100);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Page, { title: "Snap2Shop", subtitle: "Manage your visual search functionality", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout.Section, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(InlineStack, { align: "space-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "headingMd", as: "h2", children: "Product Indexing" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 177,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", tone: "subdued", children: "Index your products for visual search" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 180,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 176,
          columnNumber: 17
        }, this),
        getStatusBadge(indexStatus?.status || "no_jobs")
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 175,
        columnNumber: 15
      }, this),
      indexStatus && indexStatus.status !== "no_jobs" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockStack, { gap: "200", children: [
        indexStatus.status === "running" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProgressBar, { progress: getProgressPercentage(), size: "medium" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 189,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: [
            "Processing ",
            indexStatus.processed,
            " of ",
            indexStatus.total,
            " products"
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 190,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 188,
          columnNumber: 56
        }, this),
        indexStatus.product_count > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", fontWeight: "bold", as: "span", children: indexStatus.product_count }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 196,
            columnNumber: 23
          }, this),
          " ",
          "products indexed"
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 195,
          columnNumber: 53
        }, this),
        indexStatus.started_at && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodySm", tone: "subdued", children: [
          "Started: ",
          new Date(indexStatus.started_at).toLocaleString()
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 202,
          columnNumber: 46
        }, this),
        indexStatus.finished_at && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodySm", tone: "subdued", children: [
          "Finished: ",
          new Date(indexStatus.finished_at).toLocaleString()
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 206,
          columnNumber: 47
        }, this),
        indexStatus.error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Banner, { tone: "critical", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: indexStatus.error }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 211,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 210,
          columnNumber: 41
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 187,
        columnNumber: 67
      }, this),
      (!indexStatus || indexStatus.status === "no_jobs" || indexStatus.status === "done") && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EmptyState, { heading: indexStatus?.product_count > 0 ? "Indexing Complete" : "Get Started", action: {
        content: indexStatus?.product_count > 0 ? "Re-index Products" : "Index Products",
        onAction: startIndexing
      }, image: "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: indexStatus?.product_count > 0 ? "Your products are indexed and ready for visual search." : "Index your product catalog to enable visual search functionality." }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 219,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 215,
        columnNumber: 103
      }, this),
      (isPolling || indexStatus?.status === "running" || indexStatus?.status === "queued") && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(InlineStack, { align: "center", gap: "200", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Spinner, { size: "small" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 225,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: "Indexing in progress..." }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 226,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 224,
        columnNumber: 104
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 174,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 173,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 172,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "headingMd", as: "h3", children: "Quick Stats" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 236,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(InlineStack, { align: "space-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: "Products Indexed" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 241,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", fontWeight: "bold", children: indexStatus?.product_count || 0 }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 242,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 240,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(InlineStack, { align: "space-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: "Status" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 247,
              columnNumber: 21
            }, this),
            getStatusBadge(indexStatus?.status || "no_jobs")
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 246,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 239,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 235,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 234,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "headingMd", as: "h3", children: "Phase 0 Features" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 256,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: "\u2705 Manual product indexing" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 260,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: "\u2705 Visual similarity search" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 261,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: "\u2705 Theme app embed widget" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 262,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: "\u23F3 Auto-sync (Phase 1)" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 263,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { variant: "bodyMd", children: "\u23F3 Advanced analytics (Phase 1)" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 264,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 259,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 255,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 254,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 233,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 232,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 171,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 170,
    columnNumber: 10
  }, this);
}
_s(Index, "8+XncaQhyMgUC/pif28WonWBDG4=", false, function() {
  return [useLoaderData, useSubmit];
});
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default
};
//# sourceMappingURL=/build/routes/_index-EH5ZFX4M.js.map
