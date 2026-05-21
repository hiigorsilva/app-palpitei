import type { TGrupo } from '../type.utils'

export interface ITeam {
  id: string
  apiId: number
  name: string
  code: string | null
  flag: string | null
  continent: string | null
  flag_icon: string | null
  flag_unicode: string | null
  fifa_code: string | null
  group: TGrupo
  confed: string | null
  isPalpiteCampeao: boolean
  created_at: string
  updated_at: string
}

export interface ITeamInfo {
  id: string
  name: string
  flag: string | null
  continent: string | null
  flag_icon: string | null
  flag_unicode: string | null
  fifa_code: string | null
  group: TGrupo
  confed: string | null
  isPalpiteCampeao: boolean
}

export type IListTeamsResponse = ITeam[]
