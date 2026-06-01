import { ToRootButton } from "@/components/shared";

export default function BoardNotFoundPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold text-white mb-6">
                Дошку не знайдено!
            </h1>

            <ToRootButton />
        </div>
    );
}
