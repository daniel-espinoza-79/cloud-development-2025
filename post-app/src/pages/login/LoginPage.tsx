import LoginForm from "@/components/forms/LoginForm";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router";
const LoginPage = () => {
  const navigate = useNavigate();

  const onSwitchToLogin = () => {
    navigate("/register");
  };

  return (
      <Container className="pt-10 *:text-black">
        <LoginForm onSwitchToRegister={onSwitchToLogin} />
      </Container>
  );
};

export default LoginPage;
