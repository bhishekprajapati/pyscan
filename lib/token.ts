type TokenTypeData<T> = {
  name: string;
  symbol: T;
  logo: string;
  colors: {
    dark: {
      background: string;
      foreground: string;
    };
    light: {
      background: string;
      foreground: string;
    };
  };
  subunits: number;
  /**
   * Contract Address
   */
  address: string;
};

export class TokenType<T extends string> {
  constructor(private config: TokenTypeData<T>) {
    // TODO: add runtime checks for invalid values
  }

  getContractAddress() {
    return this.config.address;
  }

  getColors(theme: keyof (typeof this.config)["colors"]) {
    return this.config.colors[theme];
  }

  applySubunits(value: string) {
    return Number(value) / Math.pow(10, this.config.subunits);
  }

  format(value: string) {
    return `${value} ${this.config.symbol}`;
  }

  getSymbol() {
    return this.config.symbol;
  }

  getName() {
    return this.config.name;
  }

  getLogo() {
    return this.config.logo;
  }
}
