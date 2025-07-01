import Menu from "@/components/Menu";
import { Container } from "@/components/ui/Container";
import { Outlet } from "react-router";
import useFirebaseNotifications from "@/hooks/useFirebaseNotifications";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import NewPostsBanner from "@/components/NewPostsBanner";

const HomePage = () => {
  const { requestPermission, askPermission } = useFirebaseNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const enable = () => requestPermission();
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
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        children={
          <div className="p-4">
            <h1>ALLOW NOTIFICATIONS</h1>
            <Button type="button" onClick={enable}>
              ENABLE
            </Button>
          </div>
        }
      />
    </>
  );
};

export default HomePage;
