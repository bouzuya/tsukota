import { Stack } from "expo-router/stack";
import { AccountContextProvider } from "../components/AccountContext";

export default function Layout(): JSX.Element {
  return (
    <AccountContextProvider>
      <Stack />
    </AccountContextProvider>
  );
}
