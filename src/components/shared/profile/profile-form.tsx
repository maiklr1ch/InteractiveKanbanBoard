"use client";

import { FC, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, useUploadThing } from "@/lib";
import { Api } from "../../../../services/api-client";

const profileSchema = z.object({
    name: z
        .string()
        .min(2, "Мінімум 2 символи")
        .max(50, "Максимум 50 символів"),
});

type TProfileForm = z.infer<typeof profileSchema>;

export const ProfileForm: FC = () => {
    const { update, data } = useSession();

    const user = data?.user as {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.image ?? null
    );
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const { startUpload, isUploading } = useUploadThing("avatarUploader", {
        onClientUploadComplete: (res) => {
            const url = res[0].serverData?.url ?? res[0].url;

            if (!url) {
                toast.error("Не вдалося отримати URL фото");
                return;
            }

            setUploadedUrl(url);
            setAvatarPreview(url);
            toast.success("Фото завантажено");
        },
        onUploadError: (error) => {
            toast.error("Помилка завантаження: " + error.message);
            setAvatarPreview(user.image ?? null);
        },
    });

    const form = useForm<TProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user.name ?? "" },
    });

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Розмір файлу не має перевищувати 2MB");
            return;
        }

        setAvatarPreview(URL.createObjectURL(file));

        await startUpload([file]);
    };

    const onSubmit = async (data: TProfileForm) => {
        setIsSaving(true);
        try {
            // updating name to DB
            await Api.profile.update({ name: data.name, image: uploadedUrl ?? user.image });

            // updating next-auth session
            await update({
                name: data.name,
                image: uploadedUrl ?? user.image,
            });

            toast.success("Профіль оновлено");
        } catch {
            toast.error("Помилка збереження");
        } finally {
            setIsSaving(false);
        }
    };
    const initials = (user.name ?? user.email ?? "?")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
                <CardTitle className="text-white">Особисті дані</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="relative w-28 h-28 rounded-full cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {avatarPreview ? (
                            <Image
                                src={avatarPreview}
                                alt="Аватарка"
                                fill
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-white select-none">
                                {initials}
                            </div>
                        )}
                        <div
                            className={cn(
                                "absolute inset-0 rounded-full bg-black/60",
                                "flex items-center justify-center",
                                "opacity-0 group-hover:opacity-100 transition-opacity"
                            )}
                        >
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />

                    <p className="text-xs text-slate-500">
                        Клікніть на аватарку, щоб змінити її · PNG, JPG до 2MB
                    </p>
                </div>

                <div className="grid gap-2">
                    <Label className="text-slate-300">E-mail</Label>
                    <Input
                        value={user.email ?? ""}
                        disabled
                        className="text-white cursor-not-allowed opacity-60"
                    />
                </div>

                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label
                                htmlFor="profile-name"
                                className="text-slate-300"
                            >
                                {`Ім'я профіля`}
                            </Label>
                            <Input
                                id="profile-name"
                                placeholder="Ваше ім'я профіля"
                                className="text-white"
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {fieldState.error && (
                                <p className="text-red-500 text-sm">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <Button
                    className="w-full cursor-pointer"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSaving || isUploading}
                >
                    {isUploading
                        ? "Завантаження фото..."
                        : isSaving
                        ? "Збереження..."
                        : "Зберегти зміни"}
                </Button>
            </CardContent>
        </Card>
    );
};
