export interface CodeInterface {
  code: string;
}

export class Code {
  private code: String;

  constructor(codeInterface: any) {
    this.code = codeInterface.code;
  }

  getCode(): string {
    return this.code;
  }
}
