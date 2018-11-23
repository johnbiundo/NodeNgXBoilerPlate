import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class AdminUserDetailComponent implements OnInit {
  user: User;
  id: string;
  error: string;
  constructor(private route: ActivatedRoute, private svc: AccountService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  goBack() {
    this.router.navigate(['admin', 'users']);
  }
}
