import Decimal from "decimal.js";

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

export type SerializedTokenData = TokenTypeData<string>;

export class TokenType<T extends string = string> {
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
    const d = new Decimal(value);
    return d.div(Math.pow(10, this.config.subunits)).toNumber();
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

  getSubunits() {
    return this.config.subunits;
  }

  toJSON(): TokenTypeData<string> {
    return {
      name: this.config.name,
      symbol: this.config.symbol,
      logo: this.config.logo,
      colors: {
        dark: this.getColors("dark"),
        light: this.getColors("light"),
      },
      subunits: this.config.subunits,
      /**
       * Contract Address
       */
      address: this.getContractAddress(),
    };
  }
}
