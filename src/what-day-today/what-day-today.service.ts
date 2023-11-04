import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { catchError, lastValueFrom, map } from 'rxjs';
import { JSDOM } from 'jsdom';

const fiveHoursInMs = 1000 * 60 * 60 * 5;

@Injectable()
export class WhatDayTodayService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private parseDOM(html: string): string[] {
    const DOM = new JSDOM(html);

    return [
      ...DOM.window.document.querySelectorAll(
        'div[itemprop="suggestedAnswer"] span[itemprop="text"]',
      ),
    ].map((node) => node.textContent ?? '');
  }

  private sanitizeNameList(names: string[]): string[] {
    const result = [];

    for (const name of names) {
      let [newName] = name.split(' (');
      newName = newName.trim();
      if (newName) {
        result.push(newName);
      }
    }

    return result;
  }

  async getNames(): Promise<string[]> {
    const namesFromCache = await this.cacheManager.get<string[]>('dayNames');
    console.log({ namesFromCache });
    if (namesFromCache) return namesFromCache;

    const headers = {
      'Content-Type': 'text/html',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    };
    const request = this.httpService
      .get('https://kakoysegodnyaprazdnik.ru/', {
        headers,
      })
      .pipe(map((response) => response.data))
      .pipe(
        catchError((error) => {
          throw new HttpException(
            'WhatDayTodayService: Cannot get day names',
            HttpStatus.BAD_REQUEST,
            { cause: error },
          );
        }),
      );

    const html = await lastValueFrom<string>(request);
    const names = this.sanitizeNameList(this.parseDOM(html));

    if (names.length) {
      await this.cacheManager.set('dayNames', names, fiveHoursInMs);
    }

    return names;
  }
}
