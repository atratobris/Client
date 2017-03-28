import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';

import { Link } from '../link/link';

@Component({
  selector: 'app-code-snippet',
  templateUrl: './code-snippet.component.html',
  styleUrls: ['./code-snippet.component.sass']
})
export class CodeSnippetComponent implements OnInit {

  @Input() code: string;
  @Input() link: Link;

  code_header: string;
  code_body: string;
  fn_name: any;
  params: {[key: string]: any} = {};
  constructor() {
  };

  ngOnInit() {
    this.code_header = this.code.match(/def [A-Z_]+\(.+\)/i)[0];
    this.fn_name = this.code_header.match(/def (.+)\(/i)[1];
    console.log(this.fn_name);
    this.code_body = this.code.replace(`${this.code_header}\n`, '');
    const params_array = this.code_header.match(/[^(\]]+(?=\))/g)[0].split(',');
    if (Object.keys(this.link.parameters).length !== 0) {
      this.params = this.link.parameters;
    } else {
      for (const param of params_array) {
        const kv = param.trim().split('=');
        this.params[kv[0]] = this.link.parameters[kv[0]] || kv[1];
      }
      console.log(this.params);
    }
  };

  onInputChanged(event, key) {
    this.link.parameters[key] = this.params[key];
  };

  keys(): Array<string> {
    return Object.keys(this.params);
  }

}
