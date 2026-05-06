export function formatDate(dateString: string) {
  const dateFormatted = dateString.trim()
  if (dateFormatted === '') return null

  const value = new Date(dateFormatted).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return value
}

export function formatDateWithoutYear(dateString: string) {
  const dateFormatted = dateString.trim()
  if (dateFormatted === '') return null

  const date = new Date(dateFormatted).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })

  const hours = new Date(dateFormatted).getHours()
  const minutes = new Date(dateFormatted).getMinutes()
  const time = `${hours.toString().padStart(2, '0')}h${minutes
    .toString()
    .padStart(2, '0')}`
  return `${date}, ${time}`
}

export function formatDateTime(dateString: string) {
  const dateFormatted = dateString.trim()
  if (dateFormatted === '') return null

  const value = new Date(dateFormatted).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return value
}
