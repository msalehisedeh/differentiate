import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Differentiate Objects';
  save = false;
  counter = 1;
  selectedIndex = 0;
  selectedLeft;
  selectedRight;
  lefttree;
  righttree;
  samplers = {
    "Sample One": {
          occupation: "engineer",
          firstname: "masoud",
          lastname: "salehi",
          address: {
            street: "2345 blagio dr",
            city: "Los Angeles",
            contries: ["US","BS","CS"]
          },
          data: [
            [
              "Better things yet to come!"
            ]
          ]
    },
    "Sample Two": {
          firstname: "neeku",
          lastname: "salehi",
          age: 20,
          address: {
            street: "2345 blagio dr",
            city: "Los Angeles",
            contries: ["US","CS"]
          },
          methaData: [
            [
              "Better Things Yet to Come!"
            ]
          ]
    },
    "Sample Three": {
          age: 20,
          firstname: "neeku",
          lastName: "salehi",
          address: {
            street: "2345 blagio dr",
            city: "Los Angeles",
            contries: ["US","CS"]
          },
          methaData: [
            [
              "Enjoy the visual comparision tool!"
            ]
          ]
    },
    "Sample Four": {}
  }
  options: string[];

  constructor() {
    this.options = Object.keys(this.samplers);
    this.selectedLeft = this.options[0];
    this.selectedRight= this.options[1];
    this.lefttree = this.samplers[this.selectedLeft];
    this.righttree = this.samplers[this.selectedRight];
  }

  leftSideSelection(event) {
    this.selectedLeft = this.options[event.target.selectedIndex];
    this.lefttree = this.samplers[this.selectedLeft];
  }
  leftrightSideSelection(event) {
    this.selectedRight = this.options[event.target.selectedIndex];
    this.righttree = this.samplers[this.selectedRight];
  }
}
