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
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DifferentiateNodeStatus} from '../interfaces/differentiate.interfaces';

@Component({
  selector: 'differentiate-tree',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './differentiate-tree.component.html',
  styleUrls: ['./differentiate-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DifferentiateTree implements OnInit{
  depth!: number;

  @Input("collapsed")
  collapsed = true;

  @Input("expandible")
  expandible = true;

  @Input("children")
  children!: any;

  @Input("showLeftActionButton")
  showLeftActionButton = false;

  @Input("showRightActionButton")
  showRightActionButton = false;

  @Input("status")
  status = 1;

  @Input("side")
  side = "";

  @Input("level")
  level = 0;

  @Input("objectPath")
  objectPath = "";

  @Input("categorizeBy")
  categorizeBy!: string;

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
    this.depth = this.level;
  }

  bubleup(event: any) {
    event.side = this.side;
    this.onhover.emit(event);
  }

  keyup(event: any) {
    const code = event.which;
    if (code === 13) {
      event.target.click();
		}
  }

  changCounter() {
    let count = 0;
    this.children.map( (item: any) => {
      if(item.status !== DifferentiateNodeStatus.default) {
        count++;
      }
    })
    return count;
  }
  childStatus(status: any) {
    let text = '';
    switch(status) {
      case DifferentiateNodeStatus.extended: text = 'Modified in different location'; break;
      case DifferentiateNodeStatus.typeChanged: text = 'Type Changed'; break;
      case DifferentiateNodeStatus.nameChanged: text = 'Name Changed'; break;
      case DifferentiateNodeStatus.valueChanged: text = 'Value Changed'; break;
      case DifferentiateNodeStatus.added: text = 'Added'; break;
      case DifferentiateNodeStatus.removed: text = 'Removed'; break;
      default: break
    }
    return text;
  }
  expand(event: any) {
    this.onexpand.emit( this.objectPath );
  }
  autoExpand(event: any) {
    this.onexpand.emit(event);
  }
  advanceToRightSide(child: any) {
    child.path = this.objectPath + (this.objectPath.length ? ',':'') + child.index;
    this.onrevert.emit({type:"advance", node: child});
  }
  advanceToLeftSide(child: any) {
    child.path = this.objectPath + (this.objectPath.length ? ',':'') + child.index;
    this.onrevert.emit({type:"revert", node: child});
  }
  advance(event: any) {
    // bubble up the undo event.
    this.onrevert.emit(event);
  }

  mouseOvered(event: any, flag: boolean, i: number) {
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
