import { useInactivityLogout } from "../hooks/useInactivityLogout";
import { type ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export const SessionTimeoutWrapper = ({ children }: Props) => {
  // Aquí sí podemos usar hooks porque es un componente normal
  useInactivityLogout(1); // ← 60 minutos de inactividad → logout

  return <>{children}</>;
};