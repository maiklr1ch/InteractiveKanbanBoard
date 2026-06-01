"use client"

import { FC, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleAuthButton } from "./google-auth-button"
import { cn } from "@/lib";
import { loginSchema, type TLoginForm } from "./schemas/schemas"

interface ILoginForm {
    className?: string;
}

export const LoginForm: FC<ILoginForm> = ({ className }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<TLoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: TLoginForm) => {
        setIsLoading(true);

        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        setIsLoading(false);

        if (result?.error) {
            toast.error("Невірний email або пароль");
            return;
        }

        toast.success("Ласкаво просимо!");
        router.push("/boards");
        router.refresh();
    };

    return (
        <Card
            className={cn(
                className,
                "w-full max-w-md bg-slate-800 border-slate-700"
            )}
        >
            <CardHeader>
                <CardTitle className="text-white text-2xl">Вхід</CardTitle>
                <CardDescription className="text-slate-400">
                    Введіть свої дані для входу в акаунт
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <GoogleAuthButton />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-slate-800 px-2 text-slate-400">
                            або через email
                        </span>
                    </div>
                </div>

                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-300">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                value={field.value}
                                onChange={field.onChange}
                                className="text-white"
                            />
                            {fieldState.error && (
                                <p className="text-red-500 text-sm">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-slate-300"
                            >
                                Пароль
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={field.value}
                                onChange={field.onChange}
                                className="text-white"
                            />
                            {fieldState.error && (
                                <p className="text-red-500 text-sm">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </CardContent>
            <CardFooter className="flex-col gap-3">
                <Button
                    className="w-full cursor-pointer"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading}
                >
                    {isLoading ? "Завантаження..." : "Увійти"}
                </Button>
                <p className="text-slate-400 text-sm">
                    Немає акаунту?{" "}
                    <Link
                        href="/register"
                        className="text-blue-400 hover:underline"
                    >
                        Зареєструватися
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};
