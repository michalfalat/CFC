import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-default-user',
  templateUrl: './default-user.component.html',
  styleUrls: ['./default-user.component.css']
})
export class DefaultUserComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) {
  }

  ngOnInit() {
    console.log('Generating new user...');
    this.apiService.generateDefaultUser().subscribe(result => {
      console.log(result);
      this.router.navigate(['/login']);
    }, error => console.error(error));
  }

}
