export type TFase =
  | 'GRUPOS'
  | '16_AVOS'
  | 'OITAVAS'
  | 'QUARTAS'
  | 'SEMI'
  | 'FINAL'
  | 'TERCEIRO'
export type TGrupo =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
export type TPalpite = 'A' | 'B' | 'EMPATE'
export type TLoteStatus = 'ok' | 'erro'

export interface IMessageResponse {
  message: string
}
