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

export type Review = { name: string; when: string; text: string; sample?: boolean }

/** Nota e avaliações do Google (copiadas tal e qual do Perfil da Empresa). */
export const RATING = {
  score: 4.8,
  count: 321,
  url: 'https://maps.app.goo.gl/RzZxhcLZCaLCqFgd9',
  // link "pedir avaliações" do Perfil da Empresa (opcional)
  write: '',
}

// EXEMPLOS só para pré-visualizar o aspeto — a substituir pelas avaliações verdadeiras
export const REVIEWS: Review[] = [
  { name: 'Exemplo A.', when: 'há 1 mês', text: 'Texto de exemplo de uma avaliação curta, para ver como fica o cartão.', sample: true },
  { name: 'Exemplo B.', when: 'há 2 meses', text: 'Outro texto de exemplo, um pouco mais comprido, para ver como fica quando a avaliação ocupa mais linhas no cartão.', sample: true },
  { name: 'Exemplo C.', when: 'há 3 meses', text: 'Exemplo de avaliação.', sample: true },
  { name: 'Exemplo D.', when: 'há 4 meses', text: 'Mais um texto de exemplo para preencher a faixa de avaliações.', sample: true },
  { name: 'Exemplo E.', when: 'há 5 meses', text: 'Texto de exemplo número cinco, só para pré-visualização.', sample: true },
  { name: 'Exemplo F.', when: 'há 6 meses', text: 'Último exemplo.', sample: true },
]
