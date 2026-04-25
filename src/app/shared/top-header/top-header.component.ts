import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../core/services/language.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.scss',
  imports: [RouterLink, RouterLinkActive],
})
export class TopHeaderComponent {
  private languageService = inject(LanguageService);
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  user = toSignal(this.authService.user$);

  userInitial = computed(() => {
    const u = this.user();
    const name = u?.username || u?.email || u?.name || '';
    return name ? name[0].toUpperCase() : 'U';
  });

  userName = computed(() => {
    const u = this.user();
    return u?.username || u?.email || u?.name || 'User';
  });

  setLang(lang: string) {
    this.languageService.setLanguage(lang);
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/auth/login']);
  }
}
