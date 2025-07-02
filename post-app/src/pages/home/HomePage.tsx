import Menu from "@/components/Menu";
import { Container } from "@/components/ui/Container";
import { Outlet } from "react-router";
import useFirebaseNotifications from "@/hooks/useFirebaseNotifications";
import { useEffect, useState } from "react";
import NewPostsBanner from "@/components/NewPostsBanner";
import EnableNotificationsDialog from "@/components/EnableNotificationsDialog";

const HomePage = () => {
  const { requestPermission, askPermission } = useFirebaseNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const enable = async () => {
    await requestPermission();
    setIsOpen(false);
  };
  useEffect(() => {
    if (askPermission) {
      setIsOpen(true);
    }
  }, [askPermission]);

  return (
    <>
      <NewPostsBanner />
      <Menu />
      <Container>
        <Outlet />
      </Container>
      <EnableNotificationsDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        enable={enable}
      />
    </>
  );
};

export default HomePage;
