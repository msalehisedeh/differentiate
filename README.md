# Welcome to Differentiate Objects!

Have you ever needed to compare two JSON objects and make a determination on what is changed deep in the object hierarchy and be able to clearly see what is changed on either objects on the fly while they change?
Would you like to know how it can be done? Would you like to have it done without writing code for it? Take a look at the demo and enjoy the ride...

Differentiate is an Angular based code and will interpret changes deep in JSON hierarchy by displaying visual representation of changes on both sides. Add/Remove representation are done through "+" / "-" characters as well as line curves which are displayed differently based on the an attribute depth. Change of value between two name/value pairs are displayed by "~" characters.

**NOTE:** Version 1.5.0 is the latest version compatible with Angular 2, 4, or 5.


[Live Demo](https://diffrenciate.stackblitz.io) | [Source code](https://github.com/msalehisedeh/differentiate/tree/master/src/app) | [Comments/Requests](https://github.com/msalehisedeh/differentiate/issues)


## Attributes
| Attribute                |Description                                         |
|--------------------------|----------------------------------------------------|
|allowRevert               |Will allow user to revert any one of the changed attributes/values found on right hand-side to be same as left hand-side.  |
|leftSideObject            |JSON Object on left-hand side to be differentiated.  |
|rightSideObject           |JSON Object on right-hand side to be differentiated. |
|onlyShowDifferences       |If set, will ignore all attributes in JSON hierarchy which are not changed. |
|attributeOrderIsImportant |If set, will consider change of order as a difference. If not set, will sort all JSON attributes in its object hierarchy. |

## Events
| Event                |Description                                     |
|----------------------|------------------------------------------------|
|onrevert              |Will be fired when any one of changed items on right hand-side should be reverted back to mimic item on left hand-side.    |


# Version 1.5.0
Added ability to revert any changed attribute/value of JSON on right hand-side to become same as attribute/value on left hand-side. 
In addition this version will be the last version workable in Angular 2, 4, or 5. In next release, I will update dependencies to work with Angular 6 which will not fit within Angular 5, 4, or 2 because of a change made by angular folks which will cause issues between Angular 5 and 6.

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
    allowRevert="true"
    (onrevert)="revert($event)"
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

Sample view of the component at work! (You can create drop-downs and JSON log views to manipulate the **differentiate** component...)
![alt text](https://raw.githubusercontent.com/msalehisedeh/differentiate/master/sample.png "What you would see when a comparison is performed")

