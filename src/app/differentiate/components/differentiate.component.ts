/*
 * Comparision Tool will layout two comparision trees side by side and feed them an internal object
 * heirarchy created for internal use from JSON objects given to this component.
 */
import {
  Component,
  OnInit,
  OnChanges,
  Input
} from '@angular/core';

import {
  DifferentiateNode,
  DifferentiateNodeType,
  DifferentiateNodeStatus
} from '../interfaces/differentiate.interfaces';

@Component({
  selector: 'differentiate',
  templateUrl: './differentiate.component.html',
  styleUrls: ['./differentiate.component.scss'],
})
export class DifferentiateComponent implements OnInit, OnChanges {
  
  leftSide;
  rightSide;

  @Input("attributeOrderIsImportant")
  attributeOrderIsImportant = true;

  @Input("onlyShowDifferences")
  onlyShowDifferences = false;

  @Input("leftSideObject")
  leftSideObject

  @Input("rightSideObject")
  rightSideObject;

  constructor(	) {
	  
  }
  private generateNodeId() {
    const min = 1;
    const max = 10000
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  private transformNodeToInternalStruction(node) {
    let result = node;
    if (node instanceof Array) {
      const children: DifferentiateNode[] = [];
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
            parent: DifferentiateNodeType.array,
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
            parent: DifferentiateNodeType.array,
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
            parent: DifferentiateNodeType.json,
            type: DifferentiateNodeType.array,
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
            parent: DifferentiateNodeType.json,
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
    } else if (leftNode.type === DifferentiateNodeType.literal) {
      if (leftNode.value !== rightNode.value) {
            leftNode.status = DifferentiateNodeStatus.valueChanged;
            rightNode.status = DifferentiateNodeStatus.valueChanged;
      }
    } else if (leftNode.type === DifferentiateNodeType.pair) {
      if (leftNode.name !== rightNode.name) {
            leftNode.status = DifferentiateNodeStatus.nameChanged;
            rightNode.status = DifferentiateNodeStatus.nameChanged;
      }
      if (leftNode.value !== rightNode.value) {
            leftNode.status = DifferentiateNodeStatus.valueChanged;
            rightNode.status = DifferentiateNodeStatus.valueChanged;
      }
    } else {
      if (leftNode.name !== rightNode.name) {
        leftNode.status = DifferentiateNodeStatus.nameChanged;
        rightNode.status = DifferentiateNodeStatus.nameChanged;
      } else {
        this.unify(leftNode.children, rightNode.children);
      }
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
        this.compare(leftItemInRightSide, rightItemInLeftSide);
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
      if ((item.type === DifferentiateNodeType.array && item.children.length) ||
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
    if (changes.attributeOrderIsImportant) {
      this.ngOnInit();
    }
    if (changes.onlyShowDifferences) {
      this.ngOnInit();
    }
    if (changes.leftSideObject) {
      this.ngOnInit();
    }
    if (changes.rightSideObject) {
      this.ngOnInit();
    }
  }

  ngOnInit() {
    if (this.leftSideObject && this.rightSideObject) {
      const comparision = this.toInternalStruction(this.leftSideObject, this.rightSideObject);
      this.leftSide = [{
        id: this.generateNodeId(),
        name: "",
        value: "Root Object",
        parent: DifferentiateNodeType.array,
        type: DifferentiateNodeType.array,
        expanded: true,
        isRoot: true,
        children: comparision.leftSide
      }];
      this.rightSide= [{
        id: this.generateNodeId(),
        name: "",
        value: "Root Object",
        parent: DifferentiateNodeType.array,
        type: DifferentiateNodeType.array,
        expanded: true,
        isRoot: true,
        children: comparision.rightSide
      }];
    }
  }
  onhover(event) {
    let children;
    if (event.side == 'left-side') {
      children = this.rightSide[0].children;
    } else {
      children = this.leftSide[0].children;
    }
    if (children.length > event.index) {
      children[event.index].hover = event.hover;
    }
  }
}
