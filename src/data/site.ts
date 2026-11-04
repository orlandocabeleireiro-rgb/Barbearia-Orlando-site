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
    { days: 'Segunda a sexta', time: '09:00–13:00 · 14:30–19:30' },
    { days: 'Sábado', time: '09:00–13:00' },
    { days: 'Domingo', time: 'Fechado' },
  ],
} as const

export type Service = {
  name: string
  minutes: number
  price: number
  note: string
  image: string
  pos?: string
}

export const SERVICES: Service[] = [
  {
    name: 'Cabelo',
    minutes: 30,
    price: 15,
    note: 'Máquina e tesoura, com o melhor acabamento.',
    image: 'assets/servicos/cabelo.webp',
    pos: '40% 60%',
  },
  {
    name: 'Barba',
    minutes: 30,
    price: 10.5,
    note: 'Aparar, desenhar o contorno e acabar à navalha.',
    image: 'assets/servicos/barba.webp',
    pos: '50% 55%',
  },
  {
    name: 'Cabelo e barba',
    minutes: 60,
    price: 20,
    note: 'O serviço completo. Uma hora na cadeira.',
    image: 'assets/servicos/cabelo-e-barba.webp',
    pos: '55% 60%',
  },
]

export const NAV = [
  { label: 'Corte', href: '#corte' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Espaço', href: '#espaco' },
  { label: 'Equipa', href: '#equipa-barbeiros' },
  { label: 'Marcar', href: '#marcar' },
]

export type Barber = {
  name: string
  /** foto vertical (ex.: 'assets/equipa/orlando.webp'); sem foto mostra a inicial */
  photo?: string
  pos?: string
}

export const TEAM: Barber[] = [
  { name: 'Orlando', photo: 'assets/equipa/orlando.webp' },
  { name: 'Diogo', photo: 'assets/equipa/diogo.webp' },
  { name: 'Solange', photo: 'assets/equipa/solange.webp' },
  { name: 'Ariane', photo: 'assets/equipa/ariane.webp' },
]

export const euro = (n: number) =>
  n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
