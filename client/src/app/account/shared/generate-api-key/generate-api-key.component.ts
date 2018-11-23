import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiKey } from '../../../models/api-key.model';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-generate-api-key',
  templateUrl: './generate-api-key.component.html',
  styleUrls: ['./generate-api-key.component.scss']
})
export class GenerateApiKeyComponent implements OnInit {

  apiKeys: ApiKey;
  message: String;
  error: String;
  public allowedOrigins: [any];
  buttonText = 'Generate Keys';
  saveSuccess: Boolean;
  saveError: Boolean;

  errorMessages = {
    'startsWith': 'Your items need to start with \'http://\' or \'https://\''
  };

  constructor(private svc: AccountService) {
   }

  public validators = [this.startsWith];

  private startsWith(control: FormControl) {
    const httpRegex = new RegExp(/^(ht)tps?:\/\//i);
    if ((control.value.length >= 9 && !httpRegex.test(control.value)) || control.value.length <= 8) {
      return {
        'startsWith': true
      };
    }
    return null;
  }

  saveAllowedOrgins() {
    const origins = [];
    this.allowedOrigins.forEach((x: any) => {
      origins.push(x.value);
    });
    this.svc.updateApiKeys({ origins: origins }).then(res => this.saveSuccess = true).catch(err => this.saveError = true);
  }


  ngOnInit() {
    this.svc.getApiKeys().subscribe(res => {
      if (res.payload) {
        this.apiKeys = res.payload;
        this.buttonText = 'Regenerate';
      }
    });
  }


  generate() {
    this.svc.generateApiKeys().then(res => {
      this.apiKeys = res.payload;
      this.message = res.message;
    }).catch(err => err.error);

  }

}
