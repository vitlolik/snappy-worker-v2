import { Injectable } from '@nestjs/common';
import { fakeNews } from './fake-news';
import { FakeNews } from './news.types';

@Injectable()
export class NewsService {
  async getFakeNews(): Promise<FakeNews[]> {
    return Promise.resolve(fakeNews);
  }

  async getRandomFakeNews(): Promise<FakeNews> {
    const news = await this.getFakeNews();
    const randomIndex = Math.floor(Math.random() * news.length);

    return news[randomIndex];
  }
}
