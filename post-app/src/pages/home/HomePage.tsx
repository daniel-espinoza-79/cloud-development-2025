import Menu from "@/components/Menu";
import { Container } from "@/components/ui/Container";
import { Outlet } from "react-router";

const HomePage = () => {
  return (
    <>
      <Menu />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default HomePage;
