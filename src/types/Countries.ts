export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: { [key: string]: string };
  };
}
