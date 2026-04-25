import { Component, inject } from "@angular/core";
import { LanguageService } from "../../core/services/language.service";



@Component({
  selector:'app-top-header',
  templateUrl:'./top-header.component.html',
  styleUrl:'./top-header.component.scss'
})

export class TopHeaderComponent{
  tranlateService = inject(LanguageService);
  setLang(lang: string) {
    this.tranlateService.setLanguage(lang);
  }

}
