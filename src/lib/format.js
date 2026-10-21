export const formatDate = (value) => {
  if (!value) return 'Walang petsa'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Walang petsa'
  return new Intl.DateTimeFormat('fil-PH', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export const publicCategoryName = (category) => {
  if (!category) return 'Akda'
  return category.name || 'Akda'
}

export const slugify = (value) => value.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const initials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
