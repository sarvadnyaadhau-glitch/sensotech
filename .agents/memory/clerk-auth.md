---
name: SENSOTECH authentication
description: Durable authentication architecture and deployment constraint for the SENSOTECH web app.
---

SENSOTECH uses Replit-managed Clerk for web authentication. The browser uses Clerk session cookies, while the Express API validates those sessions through Clerk middleware; browser API calls should remain same-origin and should not add bearer-token handling.

**Why:** The product's original login button only simulated success with a timeout, so real account verification and server-side route protection were required.

**How to apply:** Keep sign-in and sign-up as Clerk path routes, keep the Clerk proxy before Express body parsers in production, and protect AI/crop-plan API routes with Clerk auth. Development-key warnings in preview are expected; production uses the provisioned live environment after publishing.

Replit-managed Clerk does not currently support SMS/phone sign-in or phone OTP verification. Profile completion saves name, address, and a format-validated phone number in Clerk metadata without claiming phone verification.

**Why:** The managed tenant rejects `phone_number` operations even though Clerk's generic dashboard URL mentions email/phone settings; the dashboard link does not mean this Replit-managed environment supports SMS.

**How to apply:** Do not use `user.createPhoneNumber()` or promise SMS OTP with Replit-managed Clerk. Validate the mobile format locally, save it as profile metadata, and use an external SMS provider only after explicitly selecting and configuring that architecture.