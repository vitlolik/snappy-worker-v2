import { Injectable } from '@nestjs/common';
import * as goodMorningPictureList from './good-morning.json';

@Injectable()
export class GoodMorningService {
  getRandomGoodMorningPicture(): string {
    const randomIndex = Math.floor(
      Math.random() * goodMorningPictureList.length,
    );

    return goodMorningPictureList[randomIndex];
  }
}
