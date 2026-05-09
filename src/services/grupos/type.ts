export interface IGrupo {
  id: string
  apiId: number
  name: string
  code: string | null
  logo: string | null
  group: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'
  created_at: string
  updated_at: string
}
