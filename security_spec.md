# Security Specification (Phase 0 — Payload-First Security TDD)

## 1. Data Invariants
1. **Default-Deny Catch-All**: Any path not explicitly matched is unconditionally denied (`allow read, write: if false;`).
2. **Verified Authentication**: Every write operation requires `request.auth != null && request.auth.token.email_verified == true`.
3. **Path Variable Hardening**: Every single-document operation (`get`, `create`, `update`, `delete`) validates document IDs via `isValidId()` (`size() >= 1 && size() <= 128 && matches('^[a-zA-Z0-9_\\-]+$')`).
4. **PII Split-Collection Isolation**: User PII (`email`, `phone`, `recoveryLocation`) is strictly isolated in `/users/{userId}/private/{docId}` (`docId == 'info'`) and is only readable/writable by the verified owner (`request.auth.uid == userId`), with parent `/users/{userId}` verified via `exists()` or `existsAfter()`.
5. **Strict Schema & Key Allowlisting**: Every `create` and `update` calls `isValid[Entity](incoming())` checking `keys().hasAll(...)` and `keys().hasOnly(...)`, exact types, enum values, and explicit string length bounds (`minLength` / `maxLength`).
6. **Temporal & Identity Immutability**: `createdAt` must equal `request.time` on `create` and remain immutable on `update`. `updatedAt` must equal `request.time` on `create` and `update`. `uid` must equal `request.auth.uid` on `create` and remain immutable on `update`.
7. **Action-Based Updates & Terminal State Locking**: Updates to `/notes/{noteId}` require `existing().status != 'completado'` (terminal state lock) and use explicit `affectedKeys().hasOnly(...)` action branches. `/sessions/{sessionId}` logs are append-only (no `update` allowed).
8. **Query Enforcer on List**: `allow list` on `/sessions` and `/notes` strictly enforces `resource.data.uid == request.auth.uid`.

## 2. The "Dirty Dozen" Payloads
1. **Shadow Field Injection on UserProfile**: `{ uid: "user_1", displayName: "Ana", jobTitle: "Lead", department: "Ops", organization: "Vértice", bio: "", themePreference: "light", notificationsEnabled: true, isAdmin: true, createdAt: SERVER_TIME, updatedAt: SERVER_TIME }` -> Rejected by `hasOnly()`.
2. **Unverified Email Write**: Valid `UserProfile` payload sent by user with `email_verified: false` -> Rejected by `isVerified()`.
3. **Cross-Tenant PII Read**: Authenticated `user_2` attempts `get(/users/user_1/private/info)` -> Rejected by `isOwner(userId)`.
4. **Identity Spoofing on Note Create**: Authenticated `user_1` creates `/notes/note_1` with `uid: "user_2"` -> Rejected by `data.uid == request.auth.uid`.
5. **Orphaned Subcollection Write**: Authenticated `user_1` writes `/users/user_1/private/info` when `/users/user_1` does not exist -> Rejected by Master Gate `exists(...) || existsAfter(...)`.
6. **Oversized String Resource Poisoning**: `WorkspaceNote` with `content` of 2,000 characters (limit 600) -> Rejected by `data.content.size() <= 600`.
7. **ID Poisoning Attack**: Creating `/notes/invalid$id!with*spaces` -> Rejected by `isValidId(noteId)`.
8. **Client Timestamp Forgery**: Creating `AccessSession` with past timestamp `createdAt != request.time` -> Rejected by `incoming().createdAt == request.time`.
9. **Immutable Field Mutation**: Updating `UserProfile` with modified `createdAt` or `uid` -> Rejected by `incoming().createdAt == existing().createdAt` and `affectedKeys().hasOnly(...)`.
10. **Terminal State Bypass on WorkspaceNote**: Updating a `WorkspaceNote` whose `existing().status == 'completado'` -> Rejected by Terminal State Lock `existing().status != 'completado'`.
11. **Audit Log Tampering**: Attempting `update` on `/sessions/{sessionId}` -> Rejected (`allow update: if false`).
12. **Unfiltered List Scraping**: Authenticated user running `list` on `/notes` without filtering `uid == request.auth.uid` -> Rejected by `resource.data.uid == request.auth.uid`.
