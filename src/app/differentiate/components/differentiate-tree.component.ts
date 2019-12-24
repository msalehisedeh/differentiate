/*
 * A comparision tree will layout each attribute of a json deep through its heirarchy with given visual queues
 * that represents a deletion, adition, or change of attribute from the other tree. The status of each node is 
 * evaluated by the parent comparision tool.
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {DifferentiateNodeStatus} from '../interfaces/differentiate.interfaces';

@Component({
  selector: 'differentiate-tree',
  templateUrl: './differentiate-tree.component.html',
  styleUrls: ['./differentiate-tree.component.scss'],
})
export class DifferentiateTree implements OnInit{
  depth: number;

  @Input("collapsed")
  collapsed = true;

  @Input("children")
  children;

  @Input("showLeftActionButton")
  showLeftActionButton = false;

  @Input("showRightActionButton")
  showRightActionButton = false;

  @Input("status")
  status = 1;

  @Input("side")
  side = "";

  @Input("level")
  level = "0";

  @Input("objectPath")
  objectPath = "";

  @Input("categorizeBy")
  categorizeBy: string;

  @Input("leftSideToolTip")
  leftSideToolTip = "take left side";

  @Input("rightSideToolTip")
  rightSideToolTip = "take right side";

  @Output("onhover")
  onhover = new EventEmitter();

  @Output("onrevert")
  onrevert = new EventEmitter();

  @Output("onexpand")
  onexpand = new EventEmitter();

  ngOnInit() {
    this.depth = parseInt(this.level);
  }

  bubleup(event) {
    event.side = this.side;
    this.onhover.emit(event);
  }

  keyup(event) {
    const code = event.which;
    if (code === 13) {
      event.target.click();
		}
  }

  changCounter() {
    let count = 0;
    this.children.map( (item) => {
      if(item.status !== DifferentiateNodeStatus.default) {
        count++;
      }
    })
    return count;
  }

  expand(event) {
    this.onexpand.emit( this.objectPath );
  }
  autoExpand(event) {
    this.onexpand.emit(event);
  }
  advanceToRightSide(child) {
    child.path = this.objectPath + (this.objectPath.length ? ',':'') + child.index;
    this.onrevert.emit({type:"advance", node: child});
  }
  advanceToLeftSide(child) {
    child.path = this.objectPath + (this.objectPath.length ? ',':'') + child.index;
    this.onrevert.emit({type:"revert", node: child});
  }
  advance(event) {
    // bubble up the undo event.
    this.onrevert.emit(event);
  }

  mouseOvered(event, flag, i) {
    event.preventDefault();

    if (this.depth === 2) {
      event.stopPropagation();
      
      this.onhover.emit({
        hover: flag,
        index: i,
        path: this.objectPath
      });
    }
  }
}
