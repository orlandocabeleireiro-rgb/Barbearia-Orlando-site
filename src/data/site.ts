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
    pos: '50% 40%',
  },
  {
    name: 'Barba',
    minutes: 30,
    price: 10.5,
    note: 'Aparar, desenhar o contorno e acabar à navalha.',
    image: 'assets/servicos/barba.webp',
    pos: '68% 60%',
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

export type Review = { name: string; when: string; text: string; translated?: boolean; sample?: boolean }

/** Nota e avaliações do Google (copiadas tal e qual do Perfil da Empresa). */
export const RATING = {
  score: 4.8,
  count: 321,
  url: 'https://maps.app.goo.gl/RzZxhcLZCaLCqFgd9',
  // link "pedir avaliações" do Perfil da Empresa (opcional)
  write: '',
}

// avaliações de 5 estrelas copiadas tal e qual do Google Maps (Perfil da Empresa)
export const REVIEWS: Review[] = [
  { name: 'Francisco Azevedo', when: 'há um mês', text: 'Espetacular, atendimento 5⭐, corte a um preço fantástico e preciso' },
  { name: 'António Paiva', when: 'há um ano', text: 'Altamente recomendado. Ligar antes a marcar reserva! O Orlando é um excelente profissional e um óptimo ser humano. Não serão mal atendidos nem mal servidos!' },
  { name: 'Thor', when: 'há um ano', text: 'Pessoas muito simpáticas e rápidas. Obrigado pelo bom corte de cabelo!' },
  { name: 'Rafael Pereira', when: 'há 3 anos', text: 'Atendimento espetacular. Funcionários super experientes e comunicativos. Recomendo!!' },
  { name: 'Mathilde Lefebvre', when: 'há 3 anos', translated: true, text: 'Decoração vintage, muito original e encantadora. Uma ótima experiência para meu marido e meus dois filhos, incluindo um de 2 anos. Eles mantiveram o pequeno entretido durante o evento. Atenciosos, profissionais e gentis. Eu os recomendo muito! Obrigada a todos e vida longa ao Lego Mario! 🥰👍🏻😁' },
  { name: 'Hugo Sousa', when: 'há 4 anos', text: 'Serviço impecável, atendimento excelente. Para uma experiência ainda mais simpática, aconselho a fazerem marcação prévia. Os funcionários são bastante simpáticos e com muita atenção ao detalhe. Serviços completos de barba e cabelo. Agora com expansão para a loja ao lado.' },
  { name: 'João Bastos', when: 'há 6 anos', text: 'Excelente serviço. Staff muito descontraído, comunicativo e competente. Boa relação qualidade/preço.' },
  { name: 'Hugo Fernandes', when: 'há 7 anos', text: 'Muito bom. Serviço simpático e profissional. Corresponde na perfeição à fama e aos comentários positivos. Espaço de referência sem dúvida que vou voltar. Muito bom mesmo' },
]
