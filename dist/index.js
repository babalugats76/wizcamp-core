"use strict";
// Barrel for @wizcamp/core. These re-exports are load-bearing: they make bare `import { X } from '@wizcamp/core'` work.
// Re-exports every domain module; subpath imports (e.g. '@wizcamp/core/cohort') remain the preferred form.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./primitives"), exports);
__exportStar(require("./media"), exports);
__exportStar(require("./curriculum"), exports);
__exportStar(require("./auth"), exports);
__exportStar(require("./openrouter"), exports);
__exportStar(require("./camp"), exports);
__exportStar(require("./meeting"), exports);
__exportStar(require("./enrollment"), exports);
__exportStar(require("./cohort"), exports);
__exportStar(require("./billing"), exports);
__exportStar(require("./marketing"), exports);
__exportStar(require("./calendar"), exports);
__exportStar(require("./consultation"), exports);
__exportStar(require("./api"), exports);
//# sourceMappingURL=index.js.map