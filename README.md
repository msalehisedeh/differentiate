# Differentiate

Have you ever needed to compare two JSON objects and make a determination on what is changed deep in the object hierarchy and be able to see any change on either objects on the fly as the change occurs?

## How it can be done?

Run `npm install differentiate` in your application. and do the following:

in your html:
```javascript
	<differentiate 
		[leftSideObject]="leftJSONtree" 
		[rightSideObject]="rightJSONtree"></differentiate>
```

Initiate / create both **leftJSONtree** and **rightJSONtree** in your component. At anytime if any one of the objects updated, the difference will be evaluated and displayed immediatly.

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

Sample view of the component at work! (You can create dropdowns and JSON log views to manipulate the **diffrentiate** component...)
![alt text](https://raw.githubusercontent.com/msalehisedeh/differentiate/master/sample.png "What you would see when a comparison is performed")