import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './state/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'online-auction-system';
  private store = inject(Store);

  ngOnInit() {
    // Load user from storage when app starts
    this.store.dispatch(AuthActions.loadUserFromStorage());
  }
}
