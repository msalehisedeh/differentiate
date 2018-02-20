import { Component, Input, Output, EventEmitter, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {number} */
const DifferentiateNodeType = {
    literal: 1,
    pair: 2,
    json: 3,
    array: 4,
};
DifferentiateNodeType[DifferentiateNodeType.literal] = "literal";
DifferentiateNodeType[DifferentiateNodeType.pair] = "pair";
DifferentiateNodeType[DifferentiateNodeType.json] = "json";
DifferentiateNodeType[DifferentiateNodeType.array] = "array";
/** @enum {number} */
const DifferentiateNodeStatus = {
    default: 1,
    typeChanged: 2,
    nameChanged: 3,
    valueChanged: 4,
    added: 5,
    removed: 6,
};
DifferentiateNodeStatus[DifferentiateNodeStatus.default] = "default";
DifferentiateNodeStatus[DifferentiateNodeStatus.typeChanged] = "typeChanged";
DifferentiateNodeStatus[DifferentiateNodeStatus.nameChanged] = "nameChanged";
DifferentiateNodeStatus[DifferentiateNodeStatus.valueChanged] = "valueChanged";
DifferentiateNodeStatus[DifferentiateNodeStatus.added] = "added";
DifferentiateNodeStatus[DifferentiateNodeStatus.removed] = "removed";
/**
 * @record
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DifferentiateComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    generateNodeId() {
        const /** @type {?} */ min = 1;
        const /** @type {?} */ max = 10000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    transformNodeToInternalStruction(node) {
        let /** @type {?} */ result = node;
        if (node instanceof Array) {
            const /** @type {?} */ children = [];
            node.map((item, i) => {
                const /** @type {?} */ jsonValue = this.transformNodeToInternalStruction(item);
                if (jsonValue instanceof Array) {
                    children.push({
                        id: this.generateNodeId(),
                        index: i,
                        name: "",
                        value: "",
                        parent: DifferentiateNodeType.array,
                        type: DifferentiateNodeType.array,
                        status: DifferentiateNodeStatus.default,
                        children: jsonValue
                    });
                }
                else {
                    children.push({
                        id: this.generateNodeId(),
                        index: i,
                        name: "",
                        value: jsonValue,
                        parent: DifferentiateNodeType.array,
                        type: DifferentiateNodeType.literal,
                        status: DifferentiateNodeStatus.default,
                        children: []
                    });
                }
            });
            result = children;
        }
        else if (node instanceof Object) {
            const /** @type {?} */ list = Object.keys(node);
            const /** @type {?} */ children = [];
            list.map((item, i) => {
                const /** @type {?} */ jsonValue = this.transformNodeToInternalStruction(node[item]);
                if (jsonValue instanceof Array) {
                    children.push({
                        id: this.generateNodeId(),
                        index: i,
                        name: item,
                        value: "",
                        parent: DifferentiateNodeType.json,
                        type: DifferentiateNodeType.array,
                        status: DifferentiateNodeStatus.default,
                        children: jsonValue
                    });
                }
                else {
                    children.push({
                        id: this.generateNodeId(),
                        index: i,
                        name: item,
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
    /**
     * @param {?} side
     * @param {?} node
     * @return {?}
     */
    itemInArray(side, node) {
        let /** @type {?} */ result;
        const /** @type {?} */ key = node.type === DifferentiateNodeType.literal ?
            node.value.toUpperCase() :
            node.name;
        side.map((item) => {
            if (item.type === DifferentiateNodeType.literal) {
                if (item.value.toUpperCase() === key) {
                    result = item;
                }
            }
            else {
                if (item.name === key) {
                    result = item;
                }
            }
        });
        return result;
    }
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    leftItemFromRightItem(leftNode, rightNode) {
        let /** @type {?} */ result;
        if (!leftNode || !rightNode) {
            return result;
        }
        const /** @type {?} */ key = rightNode.type === DifferentiateNodeType.literal ?
            rightNode.value.toUpperCase() :
            rightNode.name;
        if (leftNode.type === DifferentiateNodeType.literal) {
            if (leftNode.value.toUpperCase() === key) {
                result = leftNode;
            }
        }
        else {
            if (leftNode.name === key) {
                result = leftNode;
            }
        }
        return result;
    }
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    compare(leftNode, rightNode) {
        if (leftNode.type !== rightNode.type) {
            leftNode.status = DifferentiateNodeStatus.typeChanged;
            rightNode.status = DifferentiateNodeStatus.typeChanged;
        }
        else if (leftNode.type === DifferentiateNodeType.literal) {
            if (leftNode.value !== rightNode.value) {
                leftNode.status = DifferentiateNodeStatus.valueChanged;
                rightNode.status = DifferentiateNodeStatus.valueChanged;
            }
        }
        else if (leftNode.type === DifferentiateNodeType.pair) {
            if (leftNode.name !== rightNode.name) {
                leftNode.status = DifferentiateNodeStatus.nameChanged;
                rightNode.status = DifferentiateNodeStatus.nameChanged;
            }
            if (leftNode.value !== rightNode.value) {
                leftNode.status = DifferentiateNodeStatus.valueChanged;
                rightNode.status = DifferentiateNodeStatus.valueChanged;
            }
        }
        else {
            if (leftNode.name !== rightNode.name) {
                leftNode.status = DifferentiateNodeStatus.nameChanged;
                rightNode.status = DifferentiateNodeStatus.nameChanged;
            }
            else {
                this.unify(leftNode.children, rightNode.children);
            }
        }
    }
    /**
     * @param {?} list
     * @return {?}
     */
    reIndex(list) {
        list.map((item, i) => {
            item.index = i;
            this.reIndex(item.children);
        });
    }
    /**
     * @param {?} side
     * @param {?} item
     * @param {?} index
     * @param {?} status
     * @return {?}
     */
    copyInto(side, item, index, status) {
        const /** @type {?} */ newItem = JSON.parse(JSON.stringify(item));
        side.splice(index, 0, newItem);
        this.reIndex(side);
        item.status = status;
        newItem.status = status;
    }
    /**
     * @param {?} leftSide
     * @param {?} rightSide
     * @return {?}
     */
    unify(leftSide, rightSide) {
        let /** @type {?} */ i = 0, /** @type {?} */ j = 0, /** @type {?} */ looping = true;
        while (looping) {
            let /** @type {?} */ leftItemInRightSide = i < leftSide.length ? this.itemInArray(rightSide, leftSide[i]) : undefined;
            let /** @type {?} */ rightItemInLeftSide = j < rightSide.length ? this.itemInArray(leftSide, rightSide[j]) : undefined;
            if (!leftItemInRightSide && i < leftSide.length) {
                if (!rightSide.length) {
                    while (i < leftSide.length) {
                        this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                        j++;
                        i++;
                    }
                }
                else {
                    this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                    j++;
                    i++;
                }
            }
            if (!rightItemInLeftSide && j < rightSide.length) {
                if (!leftSide.length) {
                    while (j < rightSide.length) {
                        this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                        j++;
                        i++;
                    }
                }
                else {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    j++;
                    i++;
                }
            }
            if (!leftItemInRightSide) {
                leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
            }
            if (!rightItemInLeftSide) {
                rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
            }
            if (rightItemInLeftSide && rightItemInLeftSide.index !== j) {
                while (j < rightSide.length) {
                    rightItemInLeftSide = this.leftItemFromRightItem(leftSide[j], rightSide[j]);
                    if (rightItemInLeftSide) {
                        rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
                        break;
                    }
                    else {
                        this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                        j++;
                        i++;
                    }
                }
            }
            if (leftItemInRightSide && leftItemInRightSide.index !== i) {
                while (i < leftSide.length) {
                    leftItemInRightSide = this.leftItemFromRightItem(rightSide[i], leftSide[i]);
                    if (leftItemInRightSide) {
                        leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                        break;
                    }
                    else {
                        this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                        j++;
                        i++;
                    }
                }
            }
            if (rightItemInLeftSide && j < rightSide.length) {
                let /** @type {?} */ x = this.itemInArray(leftSide, rightSide[j]);
                if (x && x.index !== rightItemInLeftSide.index) {
                    this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                    j++;
                    i++;
                    rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
                }
            }
            if (leftItemInRightSide && i < leftSide.length) {
                let /** @type {?} */ x = this.itemInArray(rightSide, leftSide[i]);
                if (x && x.index !== leftItemInRightSide.index) {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    j++;
                    i++;
                    leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                }
            }
            if (leftItemInRightSide && rightItemInLeftSide) {
                this.compare(leftItemInRightSide, rightItemInLeftSide);
                j++;
                i++;
            }
            looping = (i < leftSide.length && j < rightSide.length);
        }
    }
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    toInternalStruction(leftNode, rightNode) {
        const /** @type {?} */ result = {
            leftSide: this.transformNodeToInternalStruction(leftNode),
            rightSide: this.transformNodeToInternalStruction(rightNode)
        };
        this.unify(result.leftSide, result.rightSide);
        return result;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.leftSideObject) {
            this.ngOnInit();
        }
        if (changes.rightSideObject) {
            this.ngOnInit();
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.leftSideObject && this.rightSideObject) {
            const /** @type {?} */ comparision = this.toInternalStruction(this.leftSideObject, this.rightSideObject);
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
            this.rightSide = [{
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
    /**
     * @param {?} event
     * @return {?}
     */
    onhover(event) {
        if (event.side == 'left-side') {
            this.rightSide[0].children[event.index].hover = event.hover;
        }
        else {
            this.leftSide[0].children[event.index].hover = event.hover;
        }
    }
}
DifferentiateComponent.decorators = [
    { type: Component, args: [{
                selector: 'differentiate',
                template: `<differentiate-tree
    class="root"
    level="0"
    side="left-side"
    (onhover)="onhover($event)"
    [children]="leftSide"></differentiate-tree>
<differentiate-tree
    class="root"
    level="0"
    side="right-side"
    (onhover)="onhover($event)"
    [children]="rightSide"></differentiate-tree>
`,
                styles: [`:host{
  border:1px solid #444;
  -webkit-box-sizing:border-box;
          box-sizing:border-box;
  display:block;
  max-width:100vw;
  max-height:300px;
  overflow-y:auto;
  position:relative;
  width:100%; }
`],
            },] },
];
/** @nocollapse */
DifferentiateComponent.ctorParameters = () => [];
DifferentiateComponent.propDecorators = {
    "leftSideObject": [{ type: Input, args: ["leftSideObject",] },],
    "rightSideObject": [{ type: Input, args: ["rightSideObject",] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DifferentiateTree {
    constructor() {
        this.onhover = new EventEmitter();
        this.level = "0";
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.depth = parseInt(this.level);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    bubleup(event) {
        event.side = this.side;
        this.onhover.emit(event);
    }
    /**
     * @param {?} flag
     * @param {?} i
     * @return {?}
     */
    mouseOvered(flag, i) {
        if (this.depth === 1) {
            this.onhover.emit({
                hover: flag,
                index: i,
                side: this.side
            });
        }
    }
}
DifferentiateTree.decorators = [
    { type: Component, args: [{
                selector: 'differentiate-tree',
                template: `<ul [class]="side">
  <li  *ngFor="let child of children"
    (mouseout)="mouseOvered(false, child.index)"
    (mouseover)="mouseOvered(true, child.index)"
    [class.hover]="child.hover"
    [class.added]="child.status === 5"
    [class.removed]="child.status === 6"
    [class.type-changed]="child.status === 2"
    [class.name-changed]="child.status === 3"
    [class.value-changed]="child.status === 4">
    <div class='tree-node'
        [ngClass]="'depth-' + depth"
        [id] = "child.id">
      <span *ngIf='child.name && child.name!=null'
        class='name'
        [innerHTML]="child.name.length ? child.name : '&nbsp;'">
      </span>
      <span *ngIf='child.value && child.value!=null'
        class='value'
        [class.string]="depth > 0 && child.value && child.value.length"
        [innerHTML]="child.value ? child.value : '&nbsp;'">
      </span>
    </div>
    <differentiate-tree *ngIf="child.children.length"
        [level]="depth+1"
        (onhover)="bubleup($event)"
        [class.child-node]="child.parent != 4"
        [children]='child.children'></differentiate-tree>
    <div class="upper" *ngIf="child.status > 2"></div>
    <div class="lower" *ngIf="child.status > 2"></div>
  </li>
</ul>
`,
                styles: [`:host{
  -webkit-box-sizing:border-box;
          box-sizing:border-box;
  display:inline-block;
  width:100%; }
:host.root{
  float:left;
  width:50%; }
:host.child-node{
  float:left; }
ul{
  -webkit-box-sizing:border-box;
          box-sizing:border-box;
  list-style:none;
  padding:0;
  width:100%; }
  ul li .hover{
    background-color:#ddd; }
  ul.undefined li:hover{
    background-color:#ddd; }
  ul.left-side{
    border-right:1px solid #444;
    display:inline-block;
    margin:0; }
    ul.left-side li{
      position:relative;
      display:table;
      width:100%; }
      ul.left-side li.added .name, ul.left-side li.added .value{
        opacity:0.2;
        font-style:italic; }
      ul.left-side li.added .upper{
        border:1px solid #4a4;
        border-top-width:0;
        border-left-width:0;
        border-radius:0 0 100% 0;
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:50%;
        position:absolute;
        pointer-events:none;
        width:50%;
        top:0;
        right:0; }
      ul.left-side li.added .lower{
        border:1px solid #4a4;
        border-bottom-width:0;
        border-left-width:0;
        border-radius:0 100% 0 0;
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:50%;
        position:absolute;
        pointer-events:none;
        width:50%;
        bottom:0;
        right:0; }
      ul.left-side li.removed .upper{
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:100%;
        position:absolute;
        width:66px;
        top:0;
        right:0;
        pointer-events:none; }
        ul.left-side li.removed .upper:after{
          content:' - ';
          color:#f00;
          float:right;
          padding-right:10px;
          font-size:20px;
          line-height:16px; }
      ul.left-side li.removed .lower{
        display:none; }
      ul.left-side li.removed .tree-node span{
        color:#f00; }
      ul.left-side li.type-changed .tree-node span{
        color:#f00; }
      ul.left-side li.name-changed .upper{
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:100%;
        position:absolute;
        width:66px;
        top:0;
        right:0;
        pointer-events:none; }
        ul.left-side li.name-changed .upper:after{
          content:' ~ ';
          color:#00f;
          font-weight:bold;
          float:right;
          padding-right:10px;
          font-size:20px;
          line-height:16px; }
      ul.left-side li.name-changed .tree-node .name{
        color:#00f; }
      ul.left-side li.value-changed .upper{
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:100%;
        position:absolute;
        pointer-events:none;
        width:66px;
        top:0;
        right:0; }
        ul.left-side li.value-changed .upper:after{
          content:' ~ ';
          color:#00f;
          font-weight:bold;
          float:right;
          padding-right:10px;
          font-size:20px;
          line-height:16px; }
      ul.left-side li.value-changed .tree-node .value{
        color:#00f; }
  ul.right-side{
    border-left:1px solid #444;
    display:inline-block;
    margin:0; }
    ul.right-side li{
      position:relative;
      display:table;
      width:100%; }
      ul.right-side li.added .upper{
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:100%;
        position:absolute;
        pointer-events:none;
        width:90%;
        top:0;
        left:0; }
        ul.right-side li.added .upper:after{
          content:'+';
          color:#4a4;
          font-weight:bold;
          padding-left:5px;
          font-size:20px;
          line-height:16px; }
      ul.right-side li.added .lower{
        display:none; }
      ul.right-side li.added .tree-node span{
        color:#4a4; }
      ul.right-side li.removed .name, ul.right-side li.removed .value{
        -webkit-text-decoration-line:line-through;
                text-decoration-line:line-through;
        -webkit-text-decoration-color:#ff0600;
                text-decoration-color:#ff0600; }
      ul.right-side li.removed .upper{
        border:1px solid #f00;
        border-top-width:0;
        border-right-width:0;
        border-radius:0 0 0 100%;
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:50%;
        width:10%;
        position:absolute;
        pointer-events:none;
        top:0; }
      ul.right-side li.removed .lower{
        border:1px solid #f00;
        border-bottom-width:0;
        border-right-width:0;
        border-radius:100% 0 0 0;
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:50%;
        width:10%;
        position:absolute;
        pointer-events:none;
        bottom:0; }
      ul.right-side li.type-changed .tree-node span{
        color:#f00; }
      ul.right-side li.name-changed .upper{
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:100%;
        position:absolute;
        pointer-events:none;
        top:0;
        left:0; }
        ul.right-side li.name-changed .upper:before{
          content:' ~ ';
          color:#00f;
          font-weight:bold;
          float:right;
          padding-left:5px;
          font-size:20px;
          line-height:16px; }
      ul.right-side li.name-changed .tree-node .name{
        color:#00f; }
      ul.right-side li.value-changed .upper{
        -webkit-box-sizing:border-box;
                box-sizing:border-box;
        height:100%;
        position:absolute;
        pointer-events:none;
        top:0;
        left:0; }
        ul.right-side li.value-changed .upper:before{
          content:' ~ ';
          color:#00f;
          font-weight:bold;
          float:right;
          padding-left:5px;
          font-size:20px;
          line-height:16px; }
      ul.right-side li.value-changed .tree-node .value{
        color:#00f; }
  ul .tree-node{
    -webkit-box-sizing:border-box;
            box-sizing:border-box;
    color:#7c9eb2;
    display:table;
    padding:0;
    position:relative;
    margin:0;
    width:100%; }
    ul .tree-node.depth-0{
      padding-left:5px; }
    ul .tree-node.depth-1{
      padding-left:20px; }
    ul .tree-node.depth-2{
      padding-left:40px; }
    ul .tree-node.depth-3{
      padding-left:60px; }
    ul .tree-node.depth-4{
      padding-left:80px; }
    ul .tree-node.depth-5{
      padding-left:100px; }
    ul .tree-node.depth-6{
      padding-left:120px; }
    ul .tree-node.depth-7{
      padding-left:140px; }
    ul .tree-node.depth-8{
      padding-left:160px; }
    ul .tree-node.depth-9{
      padding-left:180px; }
    ul .tree-node.depth-10{
      padding-left:200px; }
    ul .tree-node .name{
      color:#444;
      font-weight:bold; }
      ul .tree-node .name:after{
        content:':'; }
    ul .tree-node .value.string:before{
      content:'"'; }
    ul .tree-node .value.string:after{
      content:'"'; }
`],
            },] },
];
/** @nocollapse */
DifferentiateTree.ctorParameters = () => [];
DifferentiateTree.propDecorators = {
    "onhover": [{ type: Output, args: ["onhover",] },],
    "children": [{ type: Input, args: ["children",] },],
    "side": [{ type: Input, args: ["side",] },],
    "level": [{ type: Input, args: ["level",] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DifferentiateModule {
}
DifferentiateModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    DifferentiateComponent,
                    DifferentiateTree
                ],
                exports: [
                    DifferentiateComponent
                ],
                entryComponents: [],
                providers: [],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] },
];
/** @nocollapse */
DifferentiateModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { DifferentiateComponent, DifferentiateTree, DifferentiateModule };
//# sourceMappingURL=differentiate.js.map
