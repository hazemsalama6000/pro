import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";


@Injectable({
  providedIn: 'root'
})

export class LanguageService {

  translateService = inject(TranslateService);

  init() {
    console.log('LanguageService initialized');
    this.translateService.use(localStorage.getItem('lang') || 'en');
  }

  setLanguage(lang: string) {
    this.translateService.use(lang);
    this.setDirection(lang);
    this.saveStorage(lang);
  }

  setDirection(lang: string) {
    lang == 'en' ? document.documentElement.dir = 'ltr' : document.documentElement.dir = 'rtl';
  }

  saveStorage(lang: string) {
    localStorage.setItem('lang', lang);
  }

}
