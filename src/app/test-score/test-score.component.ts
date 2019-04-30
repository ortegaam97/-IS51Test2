import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { SortableComponent } from 'ngx-bootstrap';
import { elementEventFullName } from '@angular/core/src/view';

export interface ITest {
  id?: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  params = '';
  fullName: string;

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.tests = await this.loadTests();

  }

  async loadTests() {
    let tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
      // this.contacts = contacts;
    } else {
      tests = await this.loadTestsFromJson();
    }
    console.log('from ngOnInit', this.tests);
    this.tests = tests;
    return tests;
  }

  addTest() {
    const test: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null
    };
    this.tests.unshift(test);
    this.saveToLocalStorage();
    this.sort();
  }


  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  saveToLocalStorage() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }

  saveTest() {
    this.sort();
    this.saveToLocalStorage();
  }

  sort() {
    this.tests.sort((a: ITest, b: ITest) => {
      return a.id < b.id ? -1 : 1;
    });
  }
  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage();
  }

  computeGrade() {
    const commaIndex = this.params.indexOf(',');
    if (this.params === '') {
      this.toastService.showToast('warning', 5000, 'Must include name');
    } else if (commaIndex === -1) {
      this.toastService.showToast('warning', 5000, 'Must include comma');
      console.log('compute');
    } else {
    const firstName = this.params.slice(commaIndex + 2, this.params.length);
    const lastName = this.params.slice(0, commaIndex);
    this.fullName = firstName + ' ' + lastName;
    console.log(this.fullName);
    const data = this.calculate();
    localStorage.setItem('calculatedData', JSON.stringify(data));
    this.router.navigate(['home', data]);
    console.log(data);
    }

  }

  calculate() {
    let points = 0;
    let pointsPossible = 0;
    let percentage = 0;
    let grade = '';
    for (let i = 0; i < this.tests.length; i++) {
      points += this.tests[i].pointsReceived;
      pointsPossible += this.tests[i].pointsPossible;
      console.log(this.tests[i]);
      console.log(points);
      console.log(pointsPossible);
    }
    percentage = points / pointsPossible;
    if (percentage >= .90) {
      grade = 'A';
    } else if ( percentage >= .80) {
      grade = 'B';
    } else if (percentage >= .70) {
      grade = 'C';
    } else if (percentage >= .60) {
      grade = 'D';
    } else {
      grade = 'F';
    }
    return {
      fullName: this.fullName,
      pointPossible: pointsPossible,
      points: points,
      percentage: percentage,
      grade: grade
    };
  }
}
