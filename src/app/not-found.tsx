import { Header, ToRootButton } from "@/components/shared";
import { getSession } from "@/lib/get-session";

export default async function NotFoundPage() {
    const session = await getSession();

    const header = session ? <Header /> : <></>;

    return (
        <>
            {header}
            <main>
                <div className="container mx-auto py-10">
                    <h1 className="text-2xl font-bold text-white mb-6">
                        Сторінку не знайдено!
                    </h1>

                    <ToRootButton />
                </div>
            </main>
        </>
    );
}
