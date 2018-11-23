import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { UtilityService } from './services/utility.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UtilityService]
})
export class AppComponent implements OnInit {
  title = environment.title;
  hideHeader = true;
  up: Boolean;
  REFRESH_INTERVAL = 1000 * 60 * 5;
  sub: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private zone: NgZone,
    private svc: UtilityService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const timer$ = timer(1000, this.REFRESH_INTERVAL);
    this.sub = timer$.subscribe(t => {
      this.svc.ping().subscribe(
        () => {
          this.up = true;
          if (this.router.url === 'maintenance') {
            this.router.navigate(['login']);
          }
        },
        () => {
          if (environment.production) {
            this.zone.run(() => {
              this.router.navigateByUrl('maintenance');
            });
          }
        }
      );
    });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        this.titleService.setTitle(`${event['title']} | ${this.title}`);
        this.hideHeader = event['hideHeader'];
      });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    event.preventDefault();
    if (localStorage.getItem('persistLogin') === 'false') {
      localStorage.removeItem('token');
    }
  }
}
