import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  data: any = {};
  constructor(private router: Router, private toastService: ToastService) { }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('calculatedData'));
  }

  showAbout() {
    this.toastService.showToast('success', 5000, 'This application was created by Anthony Ortega (c).');

  }
}
