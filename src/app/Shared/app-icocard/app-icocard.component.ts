import { Component, OnInit, Input } from '@angular/core';
import { IICOList } from '../../core/Model/IICOList';

@Component({
  selector: 'app-app-icocard',
  templateUrl: './app-icocard.component.html',
  styleUrls: ['./app-icocard.component.css']
})
export class AppIcocardComponent implements OnInit {

  @Input() icolist: IICOList[];
  @Input() page: string;

  itemCount: number;
  icosearch: string;
  isDisplayed: boolean;

  constructor() { }

  ngOnInit() {
    if (this.page === 'investor') {
      this.itemCount = 100;
      this.isDisplayed = false;
    } else {
      this.itemCount = 6;
      this.isDisplayed = true;
    }
  }

  loadMore() {
    this.itemCount = this.itemCount + 6;
  }
}
