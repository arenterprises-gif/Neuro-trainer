// middleware.ts
export const runtime = "nodejs";

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
  "/api/dashboard(.*)",
]);

const isWebhookRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isWebhookRoute(req)) return;

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
