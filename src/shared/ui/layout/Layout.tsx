import { Link, Outlet, useLocation } from "react-router-dom";
import { AppShell, Button, Container, Title } from "@mantine/core";

import styles from "./layout.module.css";
import { ColorSchemeToggle } from "./ColorSchemeToggle";

const links = [
  {
    title: "Главная",
    link: "/",
  },
  {
    title: "Сверка логов",
    link: "/logs",
  },
];

export function Layout() {
  const { pathname } = useLocation();
  // const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      // navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      className={styles.shell}
      padding="lg"
    >
      <AppShell.Header>
        <Container className={styles.header} size="xl">
          {/* <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" /> */}
          <div className={styles.headerNav}>
            <Title className={styles.title} order={1} size={24}>
              <Link to="/">Сверка платежных систем</Link>
            </Title>
            <nav>
              {links.map(({ title, link }) => (
                <Button
                  key={link}
                  variant="transparent"
                  color={pathname === link ? "blue" : "blue"}
                  component={Link}
                  to={link}
                >
                  {title}
                </Button>
              ))}
            </nav>
          </div>
          <ColorSchemeToggle />
        </Container>
      </AppShell.Header>

      {/* <AppShell.Navbar p="md">Navbar</AppShell.Navbar> */}

      <AppShell.Main>
        <Container className={styles.content} size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
