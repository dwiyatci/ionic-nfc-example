import { Component, NgZone } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  statusMessage: string;

  constructor(
    private nfc: NFC,
    private ndef: Ndef,
    private platform: Platform,
    private ngZone: NgZone
  ) {
  }

ionViewDidEnter() {
  console.log('ionViewDidEnter');
  this.startNFC();
}

startNFC() {
  this.platform.ready().then(() => {
    console.log('nfc installed:', NFC.installed());

    this.nfc.addNdefListener(() => {
      console.log('successfully attached ndef listener');
    }, (err) => {
      console.log('error attaching ndef listener', err);
    }).subscribe((event) => {
      console.log('received ndef message. the tag contains: ', event.tag);
      console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));

      let message = this.ndef.textRecord('Hello world', 'en', '1');
      this.nfc.share([message]).then(this.onSuccess).catch(this.onError);
    });
  });
}

  onSuccess() {
    this.setStatus('Success');
  }

  onError(error) {
    this.setStatus('Error ' + error);
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
}
