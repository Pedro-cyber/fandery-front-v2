// src/app/pipes/affiliate-link.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from './../../environments/environment';

@Pipe({
  name: 'affiliateLink'
})
export class AffiliateLinkPipe implements PipeTransform {

  private encodeBase64Url(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  transform(url: string, store?: string): string {
    //const ua = navigator.userAgent;
    //const isTelegram = /Telegram/i.test(ua);

    //if (isTelegram) {

    if (store === 'miravia' && !url.includes('awin1.com')) {
      const awinmid = '37168';
      const awinaffid = '2110303';
      const base = 'https://www.awin1.com/cread.php';
      url = `${base}?awinmid=${awinmid}&awinaffid=${awinaffid}&ued=${encodeURIComponent(url)}`;
    }
      return `${environment.apiUrl}/t/${this.encodeBase64Url(url)}`;
    //}
    return url;
  }
}
