
import { Container } from "@/components/ui/Container";
import { Outlet } from "react-router";


const HomePage = () => {
  return (
    <Container>
      <Outlet/>
    </Container>
  );
};

export default HomePage;