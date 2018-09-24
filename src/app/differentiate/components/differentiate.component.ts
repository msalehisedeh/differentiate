/*
 * Comparision Tool will layout two comparision trees side by side and feed them an internal object
 * heirarchy created for internal use from JSON objects given to this component.
 */
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  DifferentiateNode,
  DifferentiateNodeType,
  DifferentiateNodeStatus
} from '../interfaces/differentiate.interfaces';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'differentiate',
  templateUrl: './differentiate.component.html',
  styleUrls: ['./differentiate.component.scss'],
})
export class DifferentiateComponent implements OnInit, OnChanges {
  
  leftSide;
  rightSide;
  ready: boolean;
  categorizeBy: string[];

  @Input("allowRevert")
  allowRevert = false;

  @Input("allowAdvance")
  allowAdvance = false;

  @Input("attributeOrderIsImportant")
  attributeOrderIsImportant = true;

  @Input("onlyShowDifferences")
  onlyShowDifferences = false;

  @Input("leftSideObject")
  leftSideObject

  @Input("rightSideObject")
  rightSideObject;

  @Input("leftSideToolTip")
  leftSideToolTip = "take left side";

  @Input("rightSideToolTip")
  rightSideToolTip = "take right side";

  @Input('namedRootObject')
  set namedRootObject(value: string) {
    let x = value.replace(" ", "");

    if (x.length) {
      this.categorizeBy = value.split(",");
    } else {
      this.categorizeBy = undefined;
    }
  }

  @Output("onrevert")
  onrevert = new EventEmitter();

  @Output("onadvance")
  onadvance = new EventEmitter();

  @Output("ondifference")
  ondifference = new EventEmitter();

  constructor(	) {
	  
  }
  private generateNodeId() {
    const min = 1;
    const max = 10000
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  private transformNodeToOriginalStructure(node, parent) {
    let json = {};
    let array = [];

    node.map( (item: DifferentiateNode) => {
      if (item.status !== DifferentiateNodeStatus.removed) {
        if (parent === DifferentiateNodeType.json) {    
          if (item.type === DifferentiateNodeType.literal) {
            array.push(item.value);
          } else if (item.type === DifferentiateNodeType.pair) {
            json[item.name] = item.value;
          } else if (item.type === DifferentiateNodeType.array) {
            const x = this.transformNodeToOriginalStructure(item.children, item.parent);
            if (item.name.length) {
              json[item.name] = x;
            } else {
              json = [x];
            }
          } else if (item.type === DifferentiateNodeType.json) {
            json[item.name] = this.transformNodeToOriginalStructure(item.children, item.parent);
          }
        } else if (parent === DifferentiateNodeType.array){
          if (item.type === DifferentiateNodeType.literal) {
            array.push(item.value);
          } else if (item.type === DifferentiateNodeType.json) {
            array.push(this.transformNodeToOriginalStructure(item, item.parent));
          } else if (item.type === DifferentiateNodeType.array) {
            array.push(this.transformNodeToOriginalStructure(item.children, item.parent));
          }
        }
      }
    });
    return array.length ? array : json;
  }
  private transformNodeToInternalStruction(node) {
    let result = node;
    if (node instanceof Array) {
      const children: DifferentiateNode[] = [];
      const p = DifferentiateNodeType.array;
      node.map( (item, i) => {
        const jsonValue: any = this.transformNodeToInternalStruction(item);
        if (jsonValue instanceof Array) {
          if (!this.attributeOrderIsImportant) {
            jsonValue.sort((a,b) => {return a.name <= b.name ? -1: 1});
            jsonValue.map( (x: DifferentiateNode, i) =>{
              x.index = i;
              x.altName = "" + i;
            });
          }
          children.push({
            id: this.generateNodeId(),
            index: i,
            name: "",
            altName: "" + i,
            value: "",
            parent: p,
            type: DifferentiateNodeType.array,
            status: DifferentiateNodeStatus.default,
            children: jsonValue
          });
        } else {
          children.push({
            id: this.generateNodeId(),
            index: i,
            name: "",
            altName: "" + i,
            value: jsonValue,
            parent: p,
            type: DifferentiateNodeType.literal,
            status: DifferentiateNodeStatus.default,
            children: []
          });
        }      
      });
      result = children;
    } else if (node instanceof Object) {
      const list = Object.keys(node);
      const children: DifferentiateNode[] = [];
      const p = DifferentiateNodeType.json;
      if (!this.attributeOrderIsImportant) {
        list.sort((a,b) => {return a <= b ? -1: 1});
      }
      list.map( (item, i) => {
        const jsonValue: any = this.transformNodeToInternalStruction(node[item]);
        if (jsonValue instanceof Array) {
          if (!this.attributeOrderIsImportant) {
            jsonValue.sort((a,b) => {return a.name <= b.name ? -1: 1});
            jsonValue.map( (x: DifferentiateNode, i) => {
              x.index = i;
              x.altName = "" + i;
            });
          }
          children.push({
            id: this.generateNodeId(),
            index: i,
            name: item,
            altName: "" + i,
            value: "",
            parent: p,
            type: DifferentiateNodeType.json,
            status: DifferentiateNodeStatus.default,
            children: jsonValue
          });
        } else {
          children.push({
            id: this.generateNodeId(),
            index: i,
            name: item,
            altName: "" + i,
            value: jsonValue,
            parent: p,
            type: DifferentiateNodeType.pair,
            status: DifferentiateNodeStatus.default,
            children: []
          });
        }
      });
      result = children;
    }
    return result;
  }

  private itemInArray(side: DifferentiateNode[], node: DifferentiateNode) {
    let result: DifferentiateNode;
    const key = node.type === DifferentiateNodeType.literal ?
                node.value.toUpperCase() :
                node.type === DifferentiateNodeType.array ?
                node.altName :
                node.name;

    side.map( (item: DifferentiateNode) => {
      if (item.type === DifferentiateNodeType.literal) {
        if (item.value.toUpperCase() === key) {
          result = item;
        }  
      } else if (item.type === DifferentiateNodeType.array) {
        if (item.altName === key) {
          result = item;
        }  
      } else {
        if (item.name === key) {
          result = item;
        }
      }
    });
    return result;
  }

  private leftItemFromRightItem(leftNode: DifferentiateNode, rightNode: DifferentiateNode) {
    let result: DifferentiateNode;
    if (!leftNode || !rightNode) {
      return result;
    }
    const key = rightNode.type === DifferentiateNodeType.literal ?
                    rightNode.value.toUpperCase() :
                    rightNode.type === DifferentiateNodeType.array ?
                    rightNode.altName :
                    rightNode.name;

    if (leftNode.type === DifferentiateNodeType.literal) {
      if (leftNode.value.toUpperCase() === key) {
        result = leftNode;
      }  
    } else if (leftNode.type === DifferentiateNodeType.array) {
      if (leftNode.altName === key) {
        result = leftNode;
      }  
    } else {
      if (leftNode.name === key) {
        result = leftNode;
      }
    }
    return result;
  }

  private compare(leftNode: DifferentiateNode, rightNode: DifferentiateNode) {
    if (leftNode.type !== rightNode.type) {
      leftNode.status = DifferentiateNodeStatus.typeChanged;
      rightNode.status = DifferentiateNodeStatus.typeChanged;
      leftNode.counterpart = rightNode.id;
      rightNode.counterpart = leftNode.id;
    } else if (leftNode.type === DifferentiateNodeType.literal) {
      if (leftNode.value !== rightNode.value) {
        leftNode.status = DifferentiateNodeStatus.valueChanged;
        rightNode.status = DifferentiateNodeStatus.valueChanged;
        leftNode.counterpart = rightNode.id;
        rightNode.counterpart = leftNode.id;
      }
    } else if (leftNode.type === DifferentiateNodeType.pair) {
      if (leftNode.name !== rightNode.name) {
        leftNode.status = DifferentiateNodeStatus.nameChanged;
        rightNode.status = DifferentiateNodeStatus.nameChanged;
        leftNode.counterpart = rightNode.id;
        rightNode.counterpart = leftNode.id;
      }
      if (leftNode.value !== rightNode.value) {
        leftNode.status = DifferentiateNodeStatus.valueChanged;
        rightNode.status = DifferentiateNodeStatus.valueChanged;
        leftNode.counterpart = rightNode.id;
        rightNode.counterpart = leftNode.id;
      }
    } else {
      if (leftNode.name !== rightNode.name) {
        leftNode.status = DifferentiateNodeStatus.nameChanged;
        rightNode.status = DifferentiateNodeStatus.nameChanged;
        leftNode.counterpart = rightNode.id;
        rightNode.counterpart = leftNode.id;
      }
      this.unify(leftNode.children, rightNode.children);
    }
  }
  private reIndex(list: DifferentiateNode[]) {
    list.map((item, i) => {
      item.index = i;
      this.reIndex(item.children);
    });
  }
  private copyInto(
              side: DifferentiateNode[],
              item: DifferentiateNode,
              index: number,
              status: DifferentiateNodeStatus) {
    const newItem = JSON.parse(JSON.stringify(item));
    side.splice(index, 0, newItem);
    this.reIndex(side);

    item.status = status;
    newItem.status = status;
    item.counterpart = newItem.id;
    newItem.counterpart = item.id;
    this.setChildrenStatus(item.children, status)
    this.setChildrenStatus(newItem.children, status)
  }
  private setChildrenStatus(list, status){
    list.map( (x) => {
      x.status = status;
      this.setChildrenStatus(x.children, status)
    });
  }
  private unify(leftSide: DifferentiateNode[], rightSide: DifferentiateNode[]) {
    let i = 0, j = 0, looping = true;

    while (looping) {
      let leftItemInRightSide: DifferentiateNode = i < leftSide.length ? this.itemInArray(rightSide, leftSide[i]) : undefined;
      let rightItemInLeftSide: DifferentiateNode = j < rightSide.length ? this.itemInArray(leftSide, rightSide[j]) : undefined;

      if (!leftItemInRightSide && i < leftSide.length) {
        if (!rightSide.length) {
          while (i < leftSide.length) {
            this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
            j++;i++;
          }
        } else {
          this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
          j++;i++;
        }
      }
      if (!rightItemInLeftSide && j < rightSide.length) {
        if (!leftSide.length) {
          while (j < rightSide.length) {
            this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
            j++;i++;
          }
        } else {
          this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
          j++;i++;
        }
      }
      if (!leftItemInRightSide) {
        leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
      }
      if (!rightItemInLeftSide) {
        rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
      }
      if (leftItemInRightSide && leftItemInRightSide.index !== i) {
        while (i < leftSide.length) {
          leftItemInRightSide = this.leftItemFromRightItem(rightSide[i], leftSide[i]);
          if (leftItemInRightSide) {
            leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
            break;
          } else {
            this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
            j++;i++;
          }
        }  
      }
      if (rightItemInLeftSide && rightItemInLeftSide.index !== j) {
        while (j < rightSide.length) {
          rightItemInLeftSide = this.leftItemFromRightItem(leftSide[j], rightSide[j]);
          if (rightItemInLeftSide) {
            rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
            break;
          } else {
            this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
            j++;i++;
          }
        }
      }
      if (leftItemInRightSide && i < leftSide.length) {
        let x = this.itemInArray(rightSide, leftSide[i]);
        if (x && x.index !== leftItemInRightSide.index) {
          this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
          j++;i++;
          leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
        }
      }
      if (rightItemInLeftSide && j < rightSide.length) {
        let x = this.itemInArray(leftSide, rightSide[j]);
        if (x && x.index !== rightItemInLeftSide.index) {
          this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
          j++;i++;
          rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
        }
      }
      if (leftItemInRightSide && rightItemInLeftSide) {
        if (leftItemInRightSide.parent !== rightItemInLeftSide.parent) {
          this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
          this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
        } else {
          this.compare(leftItemInRightSide, rightItemInLeftSide);
        }
        j++;i++;
      }
      looping = (i < leftSide.length || j < rightSide.length);
    }
  }
  private toInternalStruction(leftNode, rightNode) {
    const result = {
      leftSide: this.transformNodeToInternalStruction(leftNode),
      rightSide: this.transformNodeToInternalStruction(rightNode)
    };
    this.unify(result.leftSide, result.rightSide);

    if (this.onlyShowDifferences) {
      result.leftSide = this.filterUnchanged(result.leftSide);
      result.rightSide = this.filterUnchanged(result.rightSide);
    }
  
    return result;
  }
  private filterUnchanged(list: DifferentiateNode[]) {
    const result = [];
    
    list.map( (item) => {
      item.children = this.filterUnchanged(item.children);
      if ((item.type > DifferentiateNodeType.pair && item.children.length) ||
          item.status !== DifferentiateNodeStatus.default) {
        result.push(item);
      }
    });
    result.map( (x: DifferentiateNode, i) => {
      x.index = i;
      x.altName = "" + i;
    });
    return result;
  }

  ngOnChanges(changes) {
    if (changes.attributeOrderIsImportant ||
      changes.onlyShowDifferences ||
      changes.leftSideObject ||
      changes.namedRootObject ||
      changes.rightSideObject) {
      this.ready = false;
      this.ngOnInit();
    }
  }

  ngOnInit() {
    setTimeout(()=>this.init(),666);
  }
  private categorizedName(item) {
    let name = "";
    this.categorizeBy.map((category) => {
      if (item.name === category) {
        name = item.value;
      }
    });
    return name;
  }
  private sideCategorizedName(side) {
    side.map( (item) => {
      const names = [];
      item.children.map((child) => {
        const name = this.categorizedName(child);
        if(String(name).length) {
          names.push(name);
        }
      });
      item.categorizeBy = names.length > 1 ? names.join(" - ") : names[0];
      item.collapsed = true;
    });
  }
  private init() {
    if (this.leftSideObject && this.rightSideObject) {
      const left = (this.leftSideObject instanceof Array)  ? this.leftSideObject : [this.leftSideObject]
      const right = (this.rightSideObject instanceof Array)  ? this.rightSideObject : [this.rightSideObject]
      const comparision = this.toInternalStruction(left, right);
      if (this.categorizeBy) {
        this.sideCategorizedName(comparision.leftSide);
        this.sideCategorizedName(comparision.rightSide);
      }  
      this.leftSide = [{
        id: this.generateNodeId(),
        name: "",
        value: "Root",
        index: 0,
        parent: DifferentiateNodeType.array,
        type: DifferentiateNodeType.array,
        expanded: true,
        isRoot: true,
        children: comparision.leftSide
      }];
      this.rightSide= [{
        id: this.generateNodeId(),
        name: "",
        value: "Root",
        index: 0,
        parent: DifferentiateNodeType.array,
        type: DifferentiateNodeType.array,
        expanded: true,
        isRoot: true,
        children: comparision.rightSide
      }];
      setTimeout(()=>{
        this.ready = true;
        this.fireCountDifference();
      },333);
    }
  }
  private fireCountDifference() {
    let count = 0;
    this.leftSide[0].children.map( (item) => {
      if(item.status !== DifferentiateNodeStatus.default) {
        count++;
      }
    })
    this.ondifference.emit(count);
  }
  private lookupChildOf(side, parentObject, id) {
    let foundItem = undefined;
    if (side.id === id) {
      foundItem = {parent: parentObject, node: side};
    } else if (side.children.length) {
      side.children.map( (item) => {
        if (!foundItem) {
          foundItem = this.lookupChildOf(item, undefined, id);
          if (foundItem && foundItem.parent === undefined) {
            foundItem.parent = side;
          } else if (item.id === id) {
            foundItem = {parent: side, node: item};
          }
        }
      });
    } 
    return foundItem;
  }
  private performAdvanceToRight(leftSideInfo, rightSideInfo, status, index) {
    const modifiedChildren = this.leftSide[0].children[index].children;
    if (status === DifferentiateNodeStatus.removed) {
      leftSideInfo.node.status = DifferentiateNodeStatus.default;
      rightSideInfo.node.status = DifferentiateNodeStatus.default;
      this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status)
      this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status)
    } else if (status === DifferentiateNodeStatus.added) {
      leftSideInfo.parent.children.splice(leftSideInfo.node.index, 1);
      rightSideInfo.parent.children.splice(rightSideInfo.node.index, 1);
      this.reIndex(leftSideInfo.parent.children);
      this.reIndex(rightSideInfo.parent.children);
    } else if (status === DifferentiateNodeStatus.nameChanged) {
      leftSideInfo.node.name = rightSideInfo.node.name;
      leftSideInfo.node.status = DifferentiateNodeStatus.default;
      rightSideInfo.node.status = DifferentiateNodeStatus.default;
      this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status)
      this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status)
    } else if (status === DifferentiateNodeStatus.valueChanged) {
      rightSideInfo.node.value = leftSideInfo.node.value;
      rightSideInfo.node.status = DifferentiateNodeStatus.default;
      leftSideInfo.node.status = DifferentiateNodeStatus.default;
      this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status)
      this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status)
    } else if (status === DifferentiateNodeStatus.typeChanged) {
      leftSideInfo.node.type = rightSideInfo.node.type;
      leftSideInfo.node.status = DifferentiateNodeStatus.default;
      rightSideInfo.node.status = DifferentiateNodeStatus.default;
      this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status)
      leftSideInfo.node.children = rightSideInfo.node.children;
    }
    setTimeout(() =>{
      this.onadvance.emit(
        this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
      );
      this.fireCountDifference();
    }, 66);
  }
  private performAdvanceToLeft(leftSideInfo, rightSideInfo, status, index) {
    const modifiedChildren = this.rightSide[0].children[index].children;
    if (status === DifferentiateNodeStatus.added) {
      leftSideInfo.node.status = DifferentiateNodeStatus.default;
      rightSideInfo.node.status = DifferentiateNodeStatus.default;
      this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status)
      this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status)
    } else if (status === DifferentiateNodeStatus.removed) {
      leftSideInfo.parent.children.splice(leftSideInfo.node.index, 1);
      rightSideInfo.parent.children.splice(rightSideInfo.node.index, 1);
      this.reIndex(leftSideInfo.parent.children);
      this.reIndex(rightSideInfo.parent.children);
    } else if (status === DifferentiateNodeStatus.nameChanged) {
      rightSideInfo.node.name = leftSideInfo.node.name;
      rightSideInfo.node.status = DifferentiateNodeStatus.default;
      leftSideInfo.node.status = DifferentiateNodeStatus.default;
      this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status)
      this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status)
    } else if (status === DifferentiateNodeStatus.valueChanged) {
      leftSideInfo.node.value = rightSideInfo.node.value;
      leftSideInfo.node.status = DifferentiateNodeStatus.default;
      rightSideInfo.node.status = DifferentiateNodeStatus.default;
      this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status)
      this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status)
    } else if (status === DifferentiateNodeStatus.typeChanged) {
      rightSideInfo.node.type = leftSideInfo.node.type;
      rightSideInfo.node.status = DifferentiateNodeStatus.default;
      leftSideInfo.node.status = DifferentiateNodeStatus.default;
      this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status)
      rightSideInfo.node.children = leftSideInfo.node.children;
    }
    setTimeout(() =>{
      this.onrevert.emit(
        this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
      );
      this.fireCountDifference();
    }, 66);
  }
  advance(event) {
    const path = event.node.path.split(",");

    if (event.type === 'advance') {
      this.performAdvanceToLeft(
        this.lookupChildOf(this.leftSide[0].children[parseInt(path[1])], this.leftSide[0], event.node.id), 
        this.lookupChildOf(this.rightSide[0].children[parseInt(path[1])], this.rightSide[0], event.node.counterpart), 
        event.node.status, parseInt(path[1]));
    } else {
      this.performAdvanceToRight(
        this.lookupChildOf(this.leftSide[0].children[parseInt(path[1])], this.leftSide[0], event.node.counterpart), 
        this.lookupChildOf(this.rightSide[0].children[parseInt(path[1])], this.rightSide[0], event.node.id), 
        event.node.status, parseInt(path[1]));
    }
  }
  autoExpand(event) {
    let child;
    const path = event.split(",")
    const lc = this.rightSide[0].children[parseInt(path[1])];
    const rc = this.leftSide[0].children[parseInt(path[1])];
    
    lc.collapsed = !lc.collapsed;
    rc.collapsed = !rc.collapsed;
  }
  onhover(event) {
    let children;
    const path = event.path.split(",")
    const lc = this.rightSide[0].children[parseInt(path[1])].children;
    const rc = this.leftSide[0].children[parseInt(path[1])].children;

    lc[event.index].hover = event.hover;
    rc[event.index].hover = event.hover;
  }
}
