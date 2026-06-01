import { ProfileForm } from "@/components/shared";

export default async function ProfilePage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold text-white mb-6">Мій профіль</h1>
            <ProfileForm />
        </div>
    );
}
