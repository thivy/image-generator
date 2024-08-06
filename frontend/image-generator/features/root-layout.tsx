import { auth } from "@/auth";
import { LoadingProvider } from "./app-context";
import { AppHeader } from "./app-header";
import { InputForm } from "./input-form";

export const AppRootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth();
  const userIsAuthenticated = session !== null && session.user !== undefined;

  return (
    <LoadingProvider>
      <div className="flex flex-col flex-1">
        <div className="">
          <AppHeader />
        </div>
        <div className="flex-1 flex">{children}</div>
        <div className="">{userIsAuthenticated ? <InputForm /> : null}</div>
      </div>
    </LoadingProvider>
  );
};
