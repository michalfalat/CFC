import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-user',
  templateUrl: './default-user.component.html',
  styleUrls: ['./default-user.component.css']
})
export class DefaultUserComponent implements OnInit {

    constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router) {
      console.log("Generating new user...");
      http.post(baseUrl + 'api/Account/GenerateDefaultUser',  {}).subscribe(result => {
        console.log(result);
      }, error => console.error(error));
    }  

  ngOnInit() {    
    this.router.navigate(['/login']);
  }

}
