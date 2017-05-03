import { Injectable } from '@angular/core';

@Injectable()
export class ImageService {
  static instance: ImageService;
  static isCreating = false;
  private images: {[key: string]: HTMLImageElement};

  static getInstance(): ImageService {
    if (ImageService.instance == null) {
      ImageService.isCreating = true;
      ImageService.instance = new ImageService();
      ImageService.isCreating = false;
    }

    return ImageService.instance;
  }



  constructor() {
    if (!ImageService.isCreating) {
      throw new Error('You shouldn\'t initialise multiple Image Services');
    }
    this.images = {};
  }


  setImage(key: string, image_url: string): void {
    this.images[key] = new Image();
    this.images[key].src = image_url;
    this.images[key].onload = function() {
      console.log('Completed', key);
    };
  }

  getImage(key: string): HTMLImageElement {
    return this.images[key];
  }

  getImages(): {[key: string]: HTMLImageElement} {
    return this.images;
  }

  hasImage(key: string): Boolean {
    return !!this.images[key];
  }


}
