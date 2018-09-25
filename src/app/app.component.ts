import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Differentiate Objects';
  actions=[];
  diffCount = 0;
  onlyShowDifferences = false;
  attributeOrderIsImportant = true;
  displayEntry = false;
  error = undefined;
  save = false;
  counter = 1;
  namedRootObjectTemp = "id,firstname";
  namedRootObject = "id,firstname";
  selectedIndex = 0;
  selectedLeft;
  selectedRight;
  lefttree;
  righttree;
  sampleJson: any;
  sample: any;
  expectedActions = ["fa fa-undo","fa fa-save"];
  samplers = {
    "Sample One": [{
      id: 1,
      occupation: "engineer",
      firstname: "masoud",
      lastname: "salehi",
      address: {
        street: "2345 blagio dr",
        city: "Los Angeles",
        countries: ["US","BS","CS"]
      },
      data: [
        [
          "Better things yet to come!"
        ]
      ]
    },
    {
      id: 2,
      occupation: "composer",
      firstname: "daniel",
      lastname: "salehi",
      address: {
        street: "545 beverly dr",
        city: "Los Angeles",
        countries: ["US","BS","CS"]
      },
      data: [
        [
          "Good things are here!"
        ]
      ]
    }],
    "Sample Two": [{
      id: 2,
      firstname: "neeku",
      lastname: "salehi",
      age: 20,
      address: {
        street: "2345 blagio dr",
        city: "Los Angeles",
        countries: ["US","CS"]
      },
      extraCondition: {
        street: "2345 blagio dr",
        city: "Los Angeles",
        countries: ["US","CS"]
      },
      methaData: [
        [
          "Better Things Yet to Come!"
        ]
      ]
    },{
      id: 3,
      firstname: "Daniel",
      lastname: "salehi",
      age: 50,
      address: {
        street: "285 Cristal dr",
        city: "Los Vegas",
        countries: ["US","CS"]
      },
      methaData: [
        [
          "Better Things Yet to Come!"
        ]
      ]
    }],
    "Sample Three": {
      id: 3,
      age: 20,
      firstname: "neeku",
      lastName: "salehi",
      address: {
        street: "2345 blagio dr",
        city: "Los Angeles",
        countries: ["US","CS"]
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

  private toJson(text, message){
    let json;
    try {
      json = eval(text);
      this.error = undefined;
    }catch(e){
      this.error = message + " :: " + e.message;
      json = undefined;
    }
    return json
  }

  keyup(event) {
    this.sampleJson = event.target.value;
    this.transformToJSON();
  }
  textkeyup(event) {
    const code = event.which;
    if (code === 13) {
      this.namedRootObject = this.namedRootObjectTemp;
		}
  }
  click(event, attr) {
    if (attr === 'attributeOrderIsImportant') {
      this.attributeOrderIsImportant = event.target.checked;
    }
    if (attr === 'onlyShowDifferences') {
      this.onlyShowDifferences = event.target.checked;
    }
  }
  addDataEntry(entryName) {
    if (entryName.length) {
      if (this.sample) {
        this.samplers[entryName] = this.sample;
        this.options = Object.keys(this.samplers);
        this.displayEntry = false;
      }
    } else {
      this.error = "Please enter JSON data and a name for it to be in the dropdown!";
    }
  }

  transformToJSON() {
    this.error = undefined;
    this.sample = this.toJson(this.sampleJson, "We are unable to validate JSON data. Please clear text and try again!");
  }

  onDataPaste(event: any, sampler) {
    this.sampleJson = sampler + event.clipboardData.getData('text/plain');
    this.transformToJSON();
    if (this.sample) {
      const target = event.target;
      target.blur();
      setTimeout(() => {
        // console.log(target, this.sampleJson)
        target.value = this.sampleJson
      },2)
    }
  }
  revert(event) {
    this.actions.push(event);
  }
  advance(event) {
    this.actions.push(event);
  }
  ondifference(event){
    this.diffCount = event;
  }
}
