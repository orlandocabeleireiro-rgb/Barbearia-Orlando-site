export const SITE = {
  name: 'Barbearia Orlando',
  booking: 'https://marcacoes.barbeariaorlando.pt',
  phone: '918 871 659',
  phoneHref: 'tel:+351918871659',
  whatsapp: 'https://wa.me/351918871659',
  instagram: 'https://www.instagram.com/barbeariaorlando',
  instagramLabel: '@barbeariaorlando',
  address: ['Rua Álvaro de Castelões, 222', '4200-039 Porto'],
  maps: 'https://maps.app.goo.gl/RzZxhcLZCaLCqFgd9',
  mapEmbed: 'https://www.google.com/maps?q=Barbearia+Orlando,+Rua+%C3%81lvaro+de+Castel%C3%B5es+222,+4200-039+Porto&z=16&output=embed',
  hours: [
    { days: 'Segunda a sábado', time: '09:00–13:00 · 14:30–19:30' },
    { days: 'Domingo', time: 'Fechado' },
  ],
} as const

export type Service = {
  name: string
  minutes: number
  price: number
  note: string
  image: string
}

export const SERVICES: Service[] = [
  {
    name: 'Cabelo',
    minutes: 30,
    price: 15,
    note: 'Máquina e tesoura, com o melhor acabamento.',
    image: 'assets/trabalho.webp',
  },
  {
    name: 'Barba',
    minutes: 30,
    price: 10.5,
    note: 'Aparar, desenhar o contorno e acabar à navalha.',
    image: 'assets/barba.webp',
  },
  {
    name: 'Cabelo e barba',
    minutes: 60,
    price: 20,
    note: 'O serviço completo. Uma hora na cadeira.',
    image: 'assets/resultado.webp',
  },
]

export const NAV = [
  { label: 'Corte', href: '#corte' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Espaço', href: '#espaco' },
  { label: 'Marcar', href: '#marcar' },
]

export const euro = (n: number) =>
  n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
