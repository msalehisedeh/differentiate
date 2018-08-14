# Welcome to Differentiate Objects!

Have you ever needed to compare two JSON objects and make a determination on what is changed deep in the object hierarchy and be able to clearly see what is changed on either objects on the fly while they change?
Would you like to know how it can be done? Would you like to have it done without writing code for it? Take a look at the demo and enjoy the ride...

Differentiate is an Angular based code and will interpreat changes deep in JSON heirarchy by displaying visual representation of changes on both sides. Add/Remove representation are done through "+" / "-" characters as well as line curves which are displayed differently based on the an attribute depth. Change of value between two name/value pairs are displayed by "~" characters.

[Live Demo](https://diffrenciate.stackblitz.io) | [Source code](https://github.com/msalehisedeh/differentiate/tree/master/src/app) | [Comments/Requests](https://github.com/msalehisedeh/differentiate/issues)


## Attributes (LockTableComponent)
| Attribute                |Description                                         |
|--------------------------|----------------------------------------------------|
|leftSideObject            |JSON Object on lefthand side to be differentiated.  |
|rightSideObject           |JSON Object on righthand side to be differentiated. |
|onlyShowDifferences       |If set, will ignore all attributes in JSON heigherarchy which are not changed. |
|attributeOrderIsImportant |If set, will consider change of order as a difference. If not set, will sort all JSON attributes in its object heigherarchy. |


# Version 1.1.0
Fixed internal logic issue to handle complicated data structures. Added attributes to have a better control over the resulting display. 

# Version 1.0.0
Compiled with AOT option and resolved issues. 


# Version 0.0.6
```
MODULE:
  DifferentiateModule

EXPORTS:
  DifferentiateComponent
  DifferentiateTree
```

## So... How it can be done?

Run `npm install differentiate` in your application. and do the following:

in your html:
```javascript
	<differentiate 
    onlyShowDifferences="true"
    attributeOrderIsImportant="true"
		[leftSideObject]="leftJSONtree" 
		[rightSideObject]="rightJSONtree"></differentiate>
```

Initiate / create both **leftJSONtree** and **rightJSONtree** in your component. If at any time one of the objects updated, Differentiate  re-evaluate and displayed the difference immediately.

Include the **DifferentiateModule** module in your App module.
```javascript
	import { BrowserModule } from '@angular/platform-browser';
	import { NgModule } from '@angular/core';
	import { DifferentiateModule } from 'differentiate';

	import { AppComponent } from './app.component';

	@NgModule({
	  declarations: [
		AppComponent
	  ],
	  imports: [
		BrowserModule,
		DifferentiateModule
	  ],
	  providers: [
	  ],
	  bootstrap: [AppComponent]
	})
	export class AppModule { }
```

It is that simple..!!

Sample view of the component at work! (You can create drop-downs and JSON log views to manipulate the **diffrentiate** component...)
![alt text](https://raw.githubusercontent.com/msalehisedeh/differentiate/master/sample.png "What you would see when a comparison is performed")

