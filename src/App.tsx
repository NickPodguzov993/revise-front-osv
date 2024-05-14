import "dayjs/locale/ru";
import { SWRConfig } from "swr";
import { Route, Routes } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { Loader, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { fetcher } from "@/shared/api";
import { AuthProvider } from "./shared/hooks/useAuth";
import { Suspense, lazy } from "react";
import LoginForm from "./LoginForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import {Layout} from "@/shared/ui/layout";
import OSV from "@/pages/OSV";


function PageLoader() {
  return <Loader style={{ alignSelf: "center" }} />;
}

const HomePage = lazy(() => import("./pages/home"));
 const SettingsPage = lazy(() => import("./pages/settings"));
 const SummaryPage = lazy(() => import("./pages/summary"));
 const LogsPage = lazy(() => import("./pages/logs"));

export default function App() {
  return (
    <div>
      {
        <AuthProvider>
          <SWRConfig value={{ fetcher }}>
            <MantineProvider defaultColorScheme="auto">
              <Notifications />
              <DatesProvider settings={{ locale: "ru" }}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <LoginForm />
                      </Suspense>
                    }
                  />
                  <Route element={<Layout/>}>
                    <Route
                        path="/home"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                          </Suspense>
                        }
                    />
                      <Route
                          path="/OSV"
                          element={
                              <Suspense fallback={<PageLoader />}>
                                  <ProtectedRoute>
                                      <OSV />
                                  </ProtectedRoute>
                              </Suspense>
                          }
                      />
                    <Route
                        path="*"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            <ProtectedRoute>
                              <HomePage />
                            </ProtectedRoute>
                          </Suspense>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            <ProtectedRoute>
                              <SettingsPage />
                            </ProtectedRoute>
                          </Suspense>
                        }
                    />
                    <Route
                        path="/summary/:date"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            <ProtectedRoute>
                              <SummaryPage />
                            </ProtectedRoute>
                          </Suspense>
                        }
                    />
                    <Route
                        path="/logs"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            <ProtectedRoute>
                              <LogsPage />
                            </ProtectedRoute>
                          </Suspense>
                        }
                    />
                  </Route>

                </Routes>
              </DatesProvider>
            </MantineProvider>
          </SWRConfig>
        </AuthProvider>
      }
    </div>
  );
}
