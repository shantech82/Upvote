import { Component, OnInit, Input } from '@angular/core';
import { IICOList } from '../../core/Model/IICOList';
import {  SharedService} from '../../services/shared.service';

@Component({
  selector: 'app-app-icocard',
  templateUrl: './app-icocard.component.html',
  styleUrls: ['./app-icocard.component.css']
})
export class AppIcocardComponent implements OnInit {

  @Input() icolist: IICOList[];
  @Input() page: string;
  @Input() displayText: string;

  itemCount: number;
  icosearch: string;
  isDisplayed: boolean;
  icolistshared: IICOList[];

  constructor(private sharedservice: SharedService) {
  }

  ngOnInit() {
    if (this.page === 'investor') {
      this.itemCount = this.icolist.length;
      this.isDisplayed = false;
    } else {
      this.itemCount = 6;
      this.isDisplayed = true;
    }
    this.sharedservice.getICOLIst(this.icolist);
  }
  loadMore() {
    this.itemCount = this.itemCount + 6;
  }
}
