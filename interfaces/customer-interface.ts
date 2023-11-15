export interface IAddress {
  cep: string;
  street: string;
  number: number;
  district?: string;
  state: string;
  city: string;
  lat?: string;
  lon?: string;
}

export interface IContact {
  name: string;
  phone: string;
  email: string;
}

export interface ICustomer {
  id?: string;
  fullName: string;
  birthDate: string;
  isActive?: boolean;
  addresses: IAddress[];
  contacts: IContact[];
}
