export interface Reservation {
  userEmail: string,
  movieTitle: string,
  date: string,
  time: string,
  type: '2D' | '3D',
  numberOfTickets: number,
  pricePerTicket: number,
  totalPrice: number,
  status: 'REZERVISANO' | 'GLEDANO' | 'OTKAZANO',
  rating?: 'SVIĐA MI SE' | 'NE SVIĐA MI SE' | null 
}