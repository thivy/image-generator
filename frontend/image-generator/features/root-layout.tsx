import { LoadingProvider } from "./app-context";
import { AppHeader } from "./app-header";
import { InputForm } from "./input-form";

export const AppRootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <LoadingProvider>
      <div className="flex flex-col flex-1">
        <div className="">
          <AppHeader />
        </div>
        <div className="flex-1 flex">{children}</div>
        <div className="">
          {" "}
          <InputForm />{" "}
        </div>
      </div>
    </LoadingProvider>
  );
};
