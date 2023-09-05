import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
