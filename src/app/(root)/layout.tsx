import { redirect } from "next/navigation";
import { Header } from "@/components/shared";
import { ReactNode } from "react";
import { getSession } from "@/lib/get-session";

export default async function MainLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await getSession();
    
    if (!session) redirect("/login");

    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
}
