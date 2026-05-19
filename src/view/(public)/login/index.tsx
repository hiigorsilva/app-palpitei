import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth'
import { getStorageAuth } from '@/helpers/auth'
import { ErrorResponseApi } from '@/helpers/error'

export const Route = createFileRoute('/(public)/login/')({
  beforeLoad: () => {
    if (getStorageAuth()) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
  head: () => ({
    meta: [
      {
        title: 'Login | Palpitei',
      },
    ],
  }),
})

const loginFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve conter pelo menos 3 caracteres.')
    .max(50, 'Nome deve conter no máximo 50 caracteres.'),
})
type LoginFormData = z.infer<typeof loginFormSchema>

function LoginPage() {
  const navigate = Route.useNavigate()
  const { login } = useAuth()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      setIsPending(true)
      await login(data)
      form.reset({ name: '' })
      toast.success('Login realizado com sucesso!')
      navigate({ to: '/' })
    } catch (error) {
      ErrorResponseApi(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Container className="flex-1 flex justify-center items-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Fazer Login</CardTitle>
          <CardDescription>
            Insira suas informações de perfil abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-name">
                      Seu Nome
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Digite seu nome"
                      autoComplete="off"
                      autoFocus
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <FieldDescription>
                      Sempre utilize o mesmo nome cadastrado para fazer login.
                    </FieldDescription>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Resetar
            </Button>
            <Button type="submit" form="form-rhf-input" disabled={isPending}>
              {isPending ? 'Entrando...' : 'Entrar'}{' '}
              <ArrowRightIcon className="size-4 shrink-0" />
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </Container>
  )
}
