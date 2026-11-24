"use strict";
// Marketing domain types — Anti-Corruption Layer for external marketing platforms.
// Exports marketing topics/segments, newsletter and waitlist signup shapes, event-registration
// request/response shapes, and the opt-in/cancel token flows.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingSegment = exports.MarketingTopic = void 0;
// ─── Constants ────────────────────────────────────────────────────────────────
/** Interest areas a contact can subscribe to. */
exports.MarketingTopic = {
    NEWSLETTER: 'newsletter',
    CAMPS: 'camps',
    EVENTS: 'events',
    NEXTGEN: 'nextgen',
    PRO: 'pro',
    HOMESCHOOL: 'homeschool',
    EDUCATOR: 'educator',
};
/** Audience cohorts a campaign can be sent to. */
exports.MarketingSegment = {
    SUBSCRIBERS: 'subscribers',
    CUSTOMERS: 'customers',
    WAITLIST: 'waitlist',
};
//# sourceMappingURL=marketing.js.map