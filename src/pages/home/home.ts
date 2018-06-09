import { Component, NgZone } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  statusMessage: string;
  tag: object;
  decodedTagId: string;

  constructor(
    private nfc: NFC,
    private ndef: Ndef,
    private platform: Platform,
    private ngZone: NgZone
  ) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    // this.startNFC();
  }

  startNFC() {
    this.platform.ready().then(() => {
      console.log('nfc installed:', NFC.installed());

      this.nfc.addTagDiscoveredListener(() => {
        const successMessage = 'successfully attached tag listener';

        this.setStatus(successMessage);
      }, (err) => {
        const errorMessage = 'error attaching tag listener';

        this.setStatus(`${errorMessage}: ${err}`);
      }).subscribe((event) => {
        this.tag = event.tag;
        this.decodedTagId = this.nfc.bytesToHexString(event.tag.id);
        console.log('received tag message. the tag contains: ', this.tag);
        console.log('decoded tag id', this.decodedTagId);


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
