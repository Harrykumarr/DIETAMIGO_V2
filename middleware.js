export { default } from "next-auth/middleware";

export const config = { 
  matcher: [
    "/dashboard/:path*",
    "/diet-recommender/:path*",
    "/exercise-trainer/:path*",
    "/journal/:path*",
    "/progress-analysis/:path*",
    "/account/:path*"
  ]
};