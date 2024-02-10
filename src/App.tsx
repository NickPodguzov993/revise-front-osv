import "dayjs/locale/ru";
import { SWRConfig } from "swr";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { fetcher } from "@/shared/api";
import { router } from "@/pages";
import {AuthProvider} from "@/shared/hooks/useAuth";
import {RouterProvider} from "react-router-dom";


export default function App() {


  return (
      <AuthProvider>
      <div>
              {
                  <SWRConfig value={{ fetcher }}>
                      <MantineProvider defaultColorScheme="auto">
                        <Notifications />
                        <DatesProvider settings={{ locale: "ru" }}>
                              <RouterProvider router={router} />
                        </DatesProvider>
                      </MantineProvider>
                  </SWRConfig>

          }
      </div>
      </AuthProvider>
  );
}
