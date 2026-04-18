// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/train(.*)",
  "/models(.*)",
  "/playground(.*)",
  "/billing(.*)",
  "/integrate(.*)",
  "/settings(.*)",
  "/admin(.*)",
  "/api/train(.*)",
  "/api/jobs(.*)",
  "/api/chat(.*)",
  "/api/billing(.*)",
  "/api/datasets(.*)",
  "/api/models(.*)",
  "/api/integrate(.*)",
  "/api/admin(.*)",
  "/api/ai-brain(.*)",
  // v6: dashboard API is user-protected
  "/api/dashboard(.*)",
]);

// v6: Public routes — no auth needed
// /demo, /terms, /sign-in, /sign-up, /, /api/webhooks are all public by default

const isWebhookRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Webhooks bypass auth
  if (isWebhookRoute(req)) return;

  // Protect all dashboard/API routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // v8 fix: inject x-pathname so server components (admin layout) can detect active route
  // without client-side usePathname (which requires "use client")
  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
  runtime: "nodejs",
};
