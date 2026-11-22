"use strict";
// Consultation domain types — 1:1 booking flow shared by wizcamp-web and wizcamp-backend.
// Exports the program taxonomy, available-slot shapes, booking input/response, and cancel tokens.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationProgram = void 0;
// ─── Constants ────────────────────────────────────────────────────────────────
/** The program a prospective family is asking about; `unsure` is the undecided default. */
exports.ConsultationProgram = {
    NEXTGEN: 'nextgen',
    PRO: 'pro',
    HOMESCHOOL: 'homeschool',
    UNSURE: 'unsure',
};
//# sourceMappingURL=consultation.js.map