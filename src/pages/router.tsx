/* eslint-disable react-refresh/only-export-components */
// import { Suspense, lazy } from "react";
// import { createBrowserRouter, useRoutes } from "react-router-dom";
// import { Loader } from "@mantine/core";
// import { Layout } from "@/shared/ui";
// import LoginForm from "@/LoginForm";
// import {AuthProvider} from "@/shared/hooks/useAuth";
// import {ProtectedRoute} from "@/components/ProtectedRoute";

// const HomePage = lazy(() => import("./home"));
// const SettingsPage = lazy(() => import("./settings"));
// const SummaryPage = lazy(() => import("./summary"));
// const LogsPage = lazy(() => import("./logs"));



// export const router = createBrowserRouter([
//     {
//         path: "/",
//         element: (
//             <Suspense fallback={<PageLoader />}>
//                 <LoginForm />
//             </Suspense>
//         ),
//     },
//   {
//     element: <Layout />,
//     children: [
//       {
//         path: "/home",
//         element: (
//             <Suspense fallback={<PageLoader />}>
//                 <AuthProvider>
//                     <ProtectedRoute>
//               <HomePage />
//                     </ProtectedRoute>
//                 </AuthProvider>
//             </Suspense>
//         ),
//       },

//       {
//         path: "*",
//         element: (
//             <Suspense fallback={<PageLoader />}>
//                 <AuthProvider>
//                     <ProtectedRoute>
//                         <HomePage />
//                     </ProtectedRoute>
//                 </AuthProvider>
//             </Suspense>
//         ),
//       },
//       {
//         path: "/settings",
//         element: (
//           <Suspense fallback={<PageLoader />}>
//               <AuthProvider>
//                   <ProtectedRoute>
//                       <SettingsPage />
//                   </ProtectedRoute>
//               </AuthProvider>
//           </Suspense>
//         ),
//       },
//       {
//         path: "/summary/:date",
//         element: (
//           <Suspense fallback={<PageLoader />}>
//               <AuthProvider>
//                   <ProtectedRoute>
//                       <SummaryPage />
//                   </ProtectedRoute>
//               </AuthProvider>
//           </Suspense>
//         ),
//       },
//       {
//         path: "/logs",
//         element: (
//             <Suspense fallback={<PageLoader />}>
//                 <AuthProvider>
//                     <ProtectedRoute>
//                         <LogsPage />
//                     </ProtectedRoute>
//                 </AuthProvider>
//             </Suspense>
//         ),
//       },
//     ],
//   },
// ]);
