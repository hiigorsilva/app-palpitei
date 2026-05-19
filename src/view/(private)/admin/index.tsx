import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth'
import { ErrorResponseApi } from '@/helpers/error'

export const Route = createFileRoute('/(private)/admin/')({
  component: AdminPage,
})

const adminFormSchema = z.object({
  username: z.string().min(1, 'O nome de usuário é obrigatório'),
  password: z.string().min(1, 'A senha é obrigatória'),
})
type AdminFormData = z.infer<typeof adminFormSchema>

function AdminPage() {
  const navigate = Route.useNavigate()
  const { adminLogin } = useAuth()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: AdminFormData) {
    try {
      setIsPending(true)
      await adminLogin(data)
      form.reset({ username: '', password: '' })
      toast.success('Login de administrador bem-sucedido!')
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
          <CardTitle>Login de Administrador</CardTitle>
          <CardDescription>
            Insira as credenciais de administrador abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="form-rhf-input"
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-username">
                      Nome de Usuário
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="Digite seu nome de usuário"
                      autoComplete="off"
                      autoFocus
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-password">
                      Senha
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Digite sua senha"
                      autoComplete="off"
                      autoFocus
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
