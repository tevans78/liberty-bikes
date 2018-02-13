import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private ngZone: NgZone) {

  }

  ngOnInit() {}

  createRound() {
    $.post(`http://${document.location.hostname}:8080/round/create`, function(data) {
      alert(`Created round: ${data}`);
    });
  }

  joinRound() {
    let lc = this;
    let roundID: string = $('#roundid').val();
    roundID = roundID.toUpperCase().replace(/[^A-Z]/g, '');
    if (roundID.length !== 6) {
      alert('Not a Valid Round ID');
      return;
    }
    $.post(`http://${document.location.hostname}:8080/round/joinRound/${roundID}`, function(data) {
      if (data === 'VALID') {
        sessionStorage.setItem('username', $('#username').val());
        sessionStorage.setItem('roundId', roundID);
        lc.router.navigate(['/game']);
      } else {
        alert('Response is: ' + data);
      }
    });
  }

  hostRound() {
    // TODO: update the button on click to indicate a waiting state in case
    // this post request takes a noticeable amount of time
    let router = this.router;
    let ngZone = this.ngZone;
    $.post(`http://${document.location.hostname}:8080/round/create`, function(data) {
      console.log(`Created round with id=${data}`);
      sessionStorage.setItem('isSpectator', 'true');
      sessionStorage.setItem('roundId', data);
      ngZone.run(() => {
        router.navigate(['/game']);
      });
    });
  }
}
