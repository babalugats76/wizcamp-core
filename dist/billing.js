"use strict";
// Commerce / billing domain types — Anti-Corruption Layer for Square; no Square terminology leaks through.
// Exports checkout request shapes (Registration, Enrollee, Registrant, BillingAddress, PaymentToken) and payment responses.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTLEMENT_CURRENCY = void 0;
// ─── Constants ───────────────────────────────────────────────────────────────
/** The settlement currency for all transactions. All Square catalog items are priced in this currency. */
exports.SETTLEMENT_CURRENCY = 'USD';
//# sourceMappingURL=billing.js.map