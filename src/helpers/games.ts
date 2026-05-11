export function getFaseName(fase: string) {
  switch (fase) {
    case 'GRUPOS':
      return 'Fase de Grupos'
    case '32_AVOS':
      return 'Fase 16 Avos'
    case 'OITAVAS':
      return 'Oitavas de Final'
    case 'QUARTAS':
      return 'Quartas de Final'
    case 'SEMI':
      return 'Semi-final'
    case 'TERCEIRO':
      return 'Terceiro Lugar'
    case 'FINAL':
      return 'Final'
    default:
      break
  }
}
