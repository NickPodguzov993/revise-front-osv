/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Loader } from "@mantine/core";
import { Layout } from "@/shared/ui";
import LoginForm from "@/LoginForm";
import {AuthProvider} from "@/shared/hooks/useAuth";
import {ProtectedRoute} from "@/components/ProtectedRoute";

const HomePage = lazy(() => import("./home"));
const SettingsPage = lazy(() => import("./settings"));
const SummaryPage = lazy(() => import("./summary"));
const LogsPage = lazy(() => import("./logs"));

function PageLoader() {
  return <Loader style={{ alignSelf: "center" }} />;
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<PageLoader />}>

                <LoginForm />

            </Suspense>
        ),
    },
  {
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: (
            <Suspense fallback={<PageLoader />}>

                    <ProtectedRoute>
              <HomePage />
                    </ProtectedRoute>

            </Suspense>
        ),
      },

      {
        path: "*",
        element: (
            <Suspense fallback={<PageLoader />}>

                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>

            </Suspense>
        ),
      },
      {
        path: "/settings",
        element: (
          <Suspense fallback={<PageLoader />}>

                  <ProtectedRoute>
                      <SettingsPage />
                  </ProtectedRoute>

          </Suspense>
        ),
      },
      {
        path: "/summary/:date",
        element: (
          <Suspense fallback={<PageLoader />}>

                  <ProtectedRoute>
                      <SummaryPage />
                  </ProtectedRoute>

          </Suspense>
        ),
      },
      {
        path: "/logs",
        element: (
            <Suspense fallback={<PageLoader />}>

                    <ProtectedRoute>
                        <LogsPage />
                    </ProtectedRoute>

            </Suspense>
        ),
      },
    ],
  },
]);
