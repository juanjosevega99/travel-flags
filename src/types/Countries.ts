export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: { [key: string]: string };
  };
  capital: string;
  population: number;
  area: number;
  languages: Language[];
  currencies: Currency[];
  // TODO: Add other properties as needed
}

interface Language {
  name: string;
  nativeName: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}
