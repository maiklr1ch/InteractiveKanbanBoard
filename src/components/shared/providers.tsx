"use client";

import type { Session } from "next-auth";
import type { FC, PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

interface IProviders {
    session: Session | null;
}

export const Providers: FC<PropsWithChildren<IProviders>> = ({
    session,
    children,
}) => {
    return (
        <>
            {session ? <SessionProvider session={session}>{children}</SessionProvider> : children}
            <Toaster theme="dark" richColors position="bottom-right" />
        </>
    );
};
