import { zodResolver } from '@hookform/resolvers/zod'
import type { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import type { IBet } from '@/services/bets/type'

type PalpiteValue = IBet['palpite']

const palpiteOptions = [
  'A',
  'B',
  'EMPATE',
] as const satisfies readonly PalpiteValue[]

const createApostaFormSchema = z.object({
  palpite: z.enum(palpiteOptions, {
    error: 'Selecione um palpite para confirmar sua aposta.',
  }),
})

type CreateApostaFormData = z.infer<typeof createApostaFormSchema>

type CreateApostaDrawerProps = ComponentProps<'div'> & {
  bet: IBet
}

export function CreateApostaDrawer({
  bet,
  children,
  className,
  ...props
}: CreateApostaDrawerProps) {
  const form = useForm<CreateApostaFormData>({
    resolver: zodResolver(createApostaFormSchema),
    defaultValues: {
      palpite: undefined,
    },
  })

  function onSubmit(data: CreateApostaFormData) {
    const payload: Pick<CreateApostaFormData, 'palpite'> = {
      palpite: data.palpite,
    }

    console.log('submit aposta', payload)
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className={cn('', className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Faça sua aposta</DialogTitle>
              <DialogDescription>
                Selecione o seu palpite para essa partida.
              </DialogDescription>

              <FormField
                control={form.control}
                name="palpite"
                render={({ field }) => (
                  <FormItem className="py-4">
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-3 gap-3"
                    >
                      <Label
                        htmlFor={`palpite-${bet.id}-A`}
                        className="flex flex-col items-center gap-2 cursor-pointer rounded border-0 transition-colors has-data-checked:border-primary has-data-checked:bg-primary/5 has-data-checked:ring-2 has-data-checked:ring-primary/20 has-focus-visible:ring-3 has-focus-visible:ring-ring/50 overflow-hidden"
                      >
                        <div className="relative z-0 aspect-video w-32 h-auto rounded overflow-hidden ring-1 ring-border bg-muted">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1920px-Flag_of_Brazil.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240809055211"
                            alt="Bandeira"
                          />
                        </div>
                        <h2>{bet.team_a}</h2>
                        <RadioGroupItem
                          value="A"
                          id={`palpite-${bet.id}-A`}
                          className="sr-only"
                        />
                      </Label>
                      <Label
                        htmlFor={`palpite-${bet.id}-EMPATE`}
                        className="flex flex-col items-center gap-2 cursor-pointer rounded border-0 transition-colors has-data-checked:border-primary has-data-checked:bg-primary/5 has-data-checked:ring-2 has-data-checked:ring-primary/20 has-focus-visible:ring-3 has-focus-visible:ring-ring/50 overflow-hidden"
                      >
                        <div className="relative z-0 aspect-video w-32 h-auto rounded overflow-hidden ring-1 ring-border bg-muted">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1920px-Flag_of_Brazil.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240809055211"
                            alt="Bandeira"
                          />
                        </div>
                        <h2>Empate</h2>
                        <RadioGroupItem
                          value="EMPATE"
                          id={`palpite-${bet.id}-EMPATE`}
                          className="sr-only"
                        />
                      </Label>
                      <Label
                        htmlFor={`palpite-${bet.id}-B`}
                        className="flex flex-col items-center gap-2 cursor-pointer rounded border-0 transition-colors has-data-checked:border-primary has-data-checked:bg-primary/5 has-data-checked:ring-2 has-data-checked:ring-primary/20 has-focus-visible:ring-3 has-focus-visible:ring-ring/50 overflow-hidden"
                      >
                        <div className="relative z-0 aspect-video w-32 h-auto rounded overflow-hidden ring-1 ring-border bg-muted">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1920px-Flag_of_Brazil.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240809055211"
                            alt="Bandeira"
                          />
                        </div>
                        <h2>{bet.team_b}</h2>
                        <RadioGroupItem
                          value="B"
                          id={`palpite-${bet.id}-B`}
                          className="sr-only"
                        />
                      </Label>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="w-full flex justify-center items-center">
                <Button type="submit" className={'flex-1'}>
                  Confirmar Aposta
                </Button>
                <Button type="button" variant={'outline'} className={'flex-1'}>
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogHeader>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
