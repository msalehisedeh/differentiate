import { Component } from '@angular/core';
import { StatisticalData } from '@sedeh/differentiate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  actions: any[] = [];
  onlyShowDifferences = false;
  attributeOrderIsImportant = true;
  caseSensitive = true;
  enableRevert = true;
  enableAdvance = true;
  displayEntry = false;
  error: any = undefined;
  save = false;
  counter = 1;
  diffCount=0;
  pointsOfEntry=0;
  namedRootObjectTemp = "firstname";
  namedRootObject = "firstname";
  selectedIndex = 0;
  expandible = true;
  selectedLeft;
  selectedRight;
  lefttree;
  righttree;
  sampleJson: any;
  sample: any;
  expectedActions = ["fa fa-undo","fa fa-save"];
  samplers: any = {
    "Sample One": [{
      id: false,
      occupation: "engineer",
      firstname: "masoud",
      lastname: "salehi",
      address: {
        street: "2345 blagio dr",
        city: "Los Angeles",
        countries: ["US","BS","CS"],
        data: [10, 50, 0, 20, 2000]
      },
      data: [
        [
          "Better things yet to come!",
          false
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
        city: "los angeles",
        countries: ["US","BS","CS"],
        data: [100, 500, 0, 20, 2000]
      },
      data: [
        [
          "Good things are here!"
        ]
      ]
    }],
    "Sample Two": [{
      id: 2,
      occupation: "",
      firstname: "neeku",
      lastname: "Salehi",
      age: undefined,
      address: {
        street: "2345 blagio dr",
        city: "Los Angeles",
        countries: ["US","CS"],
        data: [10, 50, 0, 20, 2000]
      },
      extraCondition: {
        street: "2345 blagio dr",
        city: "Los Angeles",
        countries: ["US","CS"],
        data: [100, 500, 0, 20, 2000]
      },
      methaData: [
        [
          "Better Things Yet to Come!"
        ]
      ]
    },{
      id: 3,
      firstname: "Daniel",
      lastname: "Salehi",
      age: 50,
      address: {
        street: "285 Cristal dr",
        city: "Los Vegas",
        countries: ["US","CS"],
        data: [100, 500, 0, 20, 2000]
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
      lastName: "Salehi",
      address: {
        street: "2345 blagio dr",
        city: "Los Angeles",
        countries: ["US","CS"],
        data: [10, 50, 0, 20, 2000]
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

  leftSideSelection(event: any) {
    this.selectedLeft = this.options[event.target.selectedIndex];
    this.lefttree = this.samplers[this.selectedLeft];
  }
  leftrightSideSelection(event: any) {
    this.selectedRight = this.options[event.target.selectedIndex];
    this.righttree = this.samplers[this.selectedRight];
  }

  private toJson(text: string, message: string){
    let json;
    try {
      json = eval(text);
      this.error = undefined;
    }catch(e: any){
      this.error = message + " :: " + e.message;
      json = undefined;
    }
    return json
  }

  keyup(event: any) {
    this.sampleJson = event.target.value;
    this.transformToJSON();
  }
  textkeyup(event: any) {
    const code = event.which;
    if (code === 13) {
      this.namedRootObject = this.namedRootObjectTemp;
		}
  }
  click(event: any, attr: any) {
    if (attr === 'caseSensitive') {
      this.caseSensitive = event.target.checked;
    }
    if (attr === 'expandible') {
      this.expandible = event.target.checked;
    }
    if (attr === 'attributeOrderIsImportant') {
      this.attributeOrderIsImportant = event.target.checked;
    }
    if (attr === 'onlyShowDifferences') {
      this.onlyShowDifferences = event.target.checked;
    }
    if (attr === 'enableRevert') {
      this.enableRevert = event.target.checked;
    }
    if (attr === 'enableAdvance') {
      this.enableAdvance = event.target.checked;
    }
  }
  addDataEntry(entryName: string) {
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

  onDataPaste(event: any, sampler: any) {
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
  onValueEntered(event: any) {
    this.namedRootObjectTemp = event.target.value;
  }
  revert(event: StatisticalData) {
    this.actions.push(event);
  }
  advance(event: StatisticalData) {
    this.actions.push(event);
  }
  ondifference(event: StatisticalData){
    this.actions.push(event);
  }
  keys(map: any) {
    return Object.keys(map);
  }
  evaluate(item: any) {
    return (typeof item === 'object')  ? JSON.stringify(item) : item;
  }
}
