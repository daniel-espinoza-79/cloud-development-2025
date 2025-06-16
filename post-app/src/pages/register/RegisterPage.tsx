import RegisterForm from "@/components/forms/RegisterForm";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router";
const RegisterPage = () => {
  const navigate = useNavigate();

  const onSwitchToLogin = () => {
    navigate("/login");
  };

  return (
    <Container className="pt-10">
      <RegisterForm onSwitchToLogin={onSwitchToLogin} />
    </Container>
  );
};

export default RegisterPage;
