export const imagesUrl = {
  bannerProfileCard: {
    url: 'https://pzpn.pl/public/system/images/articles/6837/10359-zoom.jpg?ts=1a74e8d1aae5c350e20bd38eb2ddf577',
    alt_text: 'Banner de perfil do usuário',
  },
  flagPlaceholder: {
    url: 'https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg?s=612x612&w=0&k=20&c=ZBE3NqfzIeHGDPkyvulUw14SaWfDj2rZtyiKv3toItk=',
    alt_text: 'Bandeira placeholder',
  },
}

export function getCountryCodeFromEmoji(emoji: string): string {
  if (!emoji) return imagesUrl.flagPlaceholder.url
  return Array.from(emoji)
    .map(char => {
      const codePoint = char.codePointAt(0)
      // Se estiver no range de emojis de bandeira (Regional Indicator Symbols)
      if (codePoint && codePoint >= 127462 && codePoint <= 127514) {
        return String.fromCharCode(codePoint - 127397)
      }
      return ''
    })
    .join('')
    .toLowerCase()
}

// export function getFaseTitle(fase: string) {
//   switch (fase) {
//     case '16_AVOS':
//       return 'Fase 16 Avos'
//     case 'OITAVAS':
//       return 'Oitavas de Final'
//     case 'QUARTAS':
//       return 'Quartas de Final'
//     case 'SEMI':
//       return 'Semi de Final'
//     case 'FINAL':
//       return 'Finais'
//     case 'TERCEIRO':
//       return 'Terceiro Lugar'
//     default:
//       return ''
//   }
// }
