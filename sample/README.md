
Run `npm install @sedeh/differentiate` in your application. and do the following:

in your html:
```javascript
	<differentiate 
		onlyShowDifferences="true"
		attributeOrderIsImportant="true"
		allowRevert="true"
		allowAdvance="true"
		namedRootObject="id,firstname"
		(onrevert)="revert($event)"
		(onadvance)="advance($event)"
    	[leftSideToolTip]="'pull from ' + selectedLeft + ' file'"
    	[rightSideToolTip]="'pull from ' + selectedRight + ' file'"
		[leftSideObject]="leftJSONtree" 
		[rightSideObject]="rightJSONtree"></differentiate>
```

Initiate / create both **leftJSONtree** and **rightJSONtree** in your component. 
If at any time one of the objects updated, Differentiate  re-evaluate and displayed the difference immediately.

To handle onrevert or onadvance events, you need to do something like this
```javascript
	revert(event) {
		this.myLocalCopyOfJsonOnRightside[event.index] = event.node;
	}
```


Include the **DifferentiateModule** module in your App module.
```javascript
	import { BrowserModule } from '@angular/platform-browser';
	import { NgModule } from '@angular/core';
	import { DifferentiateComponent } from '@sedeh/differentiate';

	import { AppComponent } from './app.component';

	@NgModule({
	  declarations: [
		AppComponent
	  ],
	  imports: [
		BrowserModule,
		DifferentiateComponent
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
