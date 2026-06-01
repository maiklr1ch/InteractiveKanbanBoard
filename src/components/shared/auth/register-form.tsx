
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
import { cn } from "@/lib"
import { registerSchema, type TRegisterForm } from "./schemas/schemas"
import axios from 'axios'

interface IRegisterForm {
  className?: string
}

export const RegisterForm: FC<IRegisterForm> = ({ className }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const onSubmit = async (data: TRegisterForm) => {
    setIsLoading(true)

    try {
      await axios.post("/api/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      })

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      toast.success("Акаунт створено!")
      router.push("/boards")
      router.refresh()
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Помилка реєстрації. Спробуйте ще раз."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-md bg-slate-800 border-slate-700", className)}>
      <CardHeader>
        <CardTitle className="text-white text-2xl">Реєстрація</CardTitle>
        <CardDescription className="text-slate-400">
          Створіть новий акаунт
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <GoogleAuthButton />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-800 px-2 text-slate-400">або через email</span>
          </div>
        </div>

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label className="text-slate-300">Ім{"'"}я профіля</Label>
              <Input placeholder="Ваше ім'я профіля" value={field.value} onChange={field.onChange} className="text-white" />
              {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label className="text-slate-300">Email</Label>
              <Input type="email" placeholder="email@example.com" value={field.value} onChange={field.onChange} className="text-white" />
              {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label className="text-slate-300">Пароль</Label>
              <Input type="password" value={field.value} onChange={field.onChange} className="text-white" />
              {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label className="text-slate-300">Підтвердіть пароль</Label>
              <Input type="password" value={field.value} onChange={field.onChange} className="text-white" />
              {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
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
          {isLoading ? "Завантаження..." : "Зареєструватися"}
        </Button>
        <p className="text-slate-400 text-sm">
          Вже є акаунт?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Увійти
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
