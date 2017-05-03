import { Injectable } from '@angular/core';

@Injectable()
export class ImageService {
  static instance: ImageService;
  static isCreating = false;
  private images: {[key: string]: HTMLImageElement};
  private images_loading: {[key: string]: Boolean};

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
    this.images_loading = {};
  }


  setImage(key: string, image: HTMLImageElement): void {
    this.images[key] = image;
  }

  getImage(key: string): HTMLImageElement {
    return this.images[key];
  }

  getImages(): {[key: string]: HTMLImageElement} {
    return this.images;
  }

  getImageLoadingStatus(key: string): Boolean {
    return this.images_loading[key];
  }

  setImageLoadingStatus(key: string, loading: Boolean): void {
    this.images_loading[key] = loading;
  }
  getImagesLoadingStatus(): {[key: string]: Boolean} {
    return this.images_loading;
  }

}
