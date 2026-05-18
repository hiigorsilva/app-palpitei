import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { IRanking } from '@/services/ranking/type'
import { Card } from './ui/card'

interface RankingTableProps {
  data: IRanking[]
  variant?: 'summary' | 'full'
}

export const RankingTable = ({ data, variant = 'full' }: RankingTableProps) => {
  return (
    <Card className="w-full h-fit rounded-md border p-0 bg-transparent">
      <Table className="w-full h-fit">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-20 text-center">Pos.</TableHead>
            <TableHead>Nome</TableHead>

            {/* Sempre visível como métrica principal */}
            <TableHead className="text-right font-bold">Pts Total</TableHead>

            {variant === 'full' && (
              <>
                <TableHead className="text-right">Pts Apostas</TableHead>
                <TableHead className="text-right">Pts Bônus</TableHead>
                <TableHead className="text-right">Acertos</TableHead>
                <TableHead className="text-right">Apostas</TableHead>
              </>
            )}

            <TableHead className="text-right">Precisão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow
              key={item.userId}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="text-center font-bold">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full mx-auto',
                    item.position === 1
                      ? 'bg-yellow-500 text-white'
                      : item.position === 2
                        ? 'bg-slate-300 text-slate-800'
                        : item.position === 3
                          ? 'bg-amber-600 text-white'
                          : 'bg-transparent'
                  )}
                >
                  {item.position}
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>

              <TableCell className="text-right font-bold text-primary">
                {item.pontos_total}
              </TableCell>

              {variant === 'full' && (
                <>
                  <TableCell className="text-right">
                    {item.pontos_apostas}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    +{item.pontos_bonus}
                  </TableCell>
                  <TableCell className="text-right">{item.acertos}</TableCell>
                  <TableCell className="text-right">
                    {item.total_apostas}
                  </TableCell>
                </>
              )}

              <TableCell className="text-right">
                <Badge variant="outline" className="ml-auto">
                  {item.taxa_acerto}%
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
