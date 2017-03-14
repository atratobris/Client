export interface CodeInterface {
  code: string;
  name: string;
}

export class Code {
  private code: string;
  private name: string;

  constructor(codeInterface: any) {
    this.code = codeInterface.code;
    this.name = codeInterface.name;
  }

  getCode(): string {
    return this.code;
  }

  getName(): string {
    return this.name;
  }
}
