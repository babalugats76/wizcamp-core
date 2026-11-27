"use strict";
// Marketing domain types — Anti-Corruption Layer for external marketing platforms.
// Exports marketing topics/segments, newsletter and waitlist signup shapes, event-registration
// request/response shapes, and the opt-in/cancel token flows.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingSegment = exports.MarketingTopic = void 0;
// ─── Constants ────────────────────────────────────────────────────────────────
/** Interest areas a contact can subscribe to. */
exports.MarketingTopic = {
    NEWSLETTER: 'Newsletter',
    CAMPS: 'Camps',
    EVENTS: 'Events',
    NEXTGEN: 'NextGen',
    PRO: 'Pro',
    HOMESCHOOL: 'Homeschool',
    EDUCATOR: 'Educator',
};
/** Audience cohorts a campaign can be sent to. */
exports.MarketingSegment = {
    SUBSCRIBERS: 'Subscribers',
    CUSTOMERS: 'Customers',
    WAITLIST: 'Waitlist',
};
//# sourceMappingURL=marketing.js.map