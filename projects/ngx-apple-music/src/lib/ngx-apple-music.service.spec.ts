import { TestBed } from '@angular/core/testing';

import { NgxAppleMusicService } from './ngx-apple-music.service';

describe('NgxAppleMusicService', () => {
  let service: NgxAppleMusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAppleMusicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
