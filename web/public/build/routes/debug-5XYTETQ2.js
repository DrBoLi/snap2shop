import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  createHotContext
} from "/build/_shared/chunk-G4EA6I3U.js";
import "/build/_shared/chunk-TLBAXOHZ.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-CBDF6H27.js";
import "/build/_shared/chunk-G4YTFA6Y.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/debug.tsx
var import_node = __toESM(require_node(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/debug.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/debug.tsx"
  );
  import.meta.hot.lastModified = "1757478382212.4731";
}
function Debug() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: {
    padding: "20px",
    fontFamily: "monospace"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Debug Page" }, void 0, false, {
      fileName: "app/routes/debug.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "If you can see this, the basic routing is working." }, void 0, false, {
      fileName: "app/routes/debug.tsx",
      lineNumber: 42,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Check the JSON response by visiting /debug with Accept: application/json" }, void 0, false, {
      fileName: "app/routes/debug.tsx",
      lineNumber: 43,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/debug.tsx",
    lineNumber: 37,
    columnNumber: 10
  }, this);
}
_c = Debug;
var _c;
$RefreshReg$(_c, "Debug");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Debug as default
};
//# sourceMappingURL=/build/routes/debug-5XYTETQ2.js.map
