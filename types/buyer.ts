export interface Buyer {
  _id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: string;
  provincia: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuyerDTO {
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: string;
  provincia: string;
}