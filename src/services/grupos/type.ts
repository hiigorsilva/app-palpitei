export interface IGrupo {
  id: string
  apiId: number
  name: string
  code: string | null
  flag: string | null
  continent: string | null
  flag_icon: string | null
  flag_unicode: string | null
  fifa_code: string | null
  group: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'
  isPalpiteCampeao: boolean
  confed: string | null
  created_at: string
  updated_at: string
}
