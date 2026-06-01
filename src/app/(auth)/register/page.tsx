import { RegisterForm } from "@/components/shared";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    const session = await getSession();
    if (session) redirect("/boards");

    return <RegisterForm />;
}
