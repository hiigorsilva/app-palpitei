import { flagPlaceholder } from './placeholders'

export function getCountryCodeFromEmoji(emoji: string): string {
  if (!emoji) return flagPlaceholder
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
