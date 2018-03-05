(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
	(factory((global.differentiate = {}),global.ng.core,global.ng.common));
}(this, (function (exports,core,common) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {number} */
var DifferentiateNodeType = {
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
var DifferentiateNodeStatus = {
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
var DifferentiateComponent = (function () {
    function DifferentiateComponent() {
    }
    /**
     * @return {?}
     */
    DifferentiateComponent.prototype.generateNodeId = function () {
        var /** @type {?} */ min = 1;
        var /** @type {?} */ max = 10000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    DifferentiateComponent.prototype.transformNodeToInternalStruction = function (node) {
        var _this = this;
        var /** @type {?} */ result = node;
        if (node instanceof Array) {
            var /** @type {?} */ children_1 = [];
            node.map(function (item, i) {
                var /** @type {?} */ jsonValue = _this.transformNodeToInternalStruction(item);
                if (jsonValue instanceof Array) {
                    children_1.push({
                        id: _this.generateNodeId(),
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
                    children_1.push({
                        id: _this.generateNodeId(),
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
            result = children_1;
        }
        else if (node instanceof Object) {
            var /** @type {?} */ list = Object.keys(node);
            var /** @type {?} */ children_2 = [];
            list.map(function (item, i) {
                var /** @type {?} */ jsonValue = _this.transformNodeToInternalStruction(node[item]);
                if (jsonValue instanceof Array) {
                    children_2.push({
                        id: _this.generateNodeId(),
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
                    children_2.push({
                        id: _this.generateNodeId(),
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
            result = children_2;
        }
        return result;
    };
    /**
     * @param {?} side
     * @param {?} node
     * @return {?}
     */
    DifferentiateComponent.prototype.itemInArray = function (side, node) {
        var /** @type {?} */ result;
        var /** @type {?} */ key = node.type === DifferentiateNodeType.literal ?
            node.value.toUpperCase() :
            node.name;
        side.map(function (item) {
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
    };
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    DifferentiateComponent.prototype.leftItemFromRightItem = function (leftNode, rightNode) {
        var /** @type {?} */ result;
        if (!leftNode || !rightNode) {
            return result;
        }
        var /** @type {?} */ key = rightNode.type === DifferentiateNodeType.literal ?
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
    };
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    DifferentiateComponent.prototype.compare = function (leftNode, rightNode) {
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
    };
    /**
     * @param {?} list
     * @return {?}
     */
    DifferentiateComponent.prototype.reIndex = function (list) {
        var _this = this;
        list.map(function (item, i) {
            item.index = i;
            _this.reIndex(item.children);
        });
    };
    /**
     * @param {?} side
     * @param {?} item
     * @param {?} index
     * @param {?} status
     * @return {?}
     */
    DifferentiateComponent.prototype.copyInto = function (side, item, index, status) {
        var /** @type {?} */ newItem = JSON.parse(JSON.stringify(item));
        side.splice(index, 0, newItem);
        this.reIndex(side);
        item.status = status;
        newItem.status = status;
    };
    /**
     * @param {?} leftSide
     * @param {?} rightSide
     * @return {?}
     */
    DifferentiateComponent.prototype.unify = function (leftSide, rightSide) {
        var /** @type {?} */ i = 0, /** @type {?} */ j = 0, /** @type {?} */ looping = true;
        while (looping) {
            var /** @type {?} */ leftItemInRightSide = i < leftSide.length ? this.itemInArray(rightSide, leftSide[i]) : undefined;
            var /** @type {?} */ rightItemInLeftSide = j < rightSide.length ? this.itemInArray(leftSide, rightSide[j]) : undefined;
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
            if (leftItemInRightSide && i < leftSide.length) {
                var /** @type {?} */ x = this.itemInArray(rightSide, leftSide[i]);
                if (x && x.index !== leftItemInRightSide.index) {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    j++;
                    i++;
                    leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                }
            }
            if (rightItemInLeftSide && j < rightSide.length) {
                var /** @type {?} */ x = this.itemInArray(leftSide, rightSide[j]);
                if (x && x.index !== rightItemInLeftSide.index) {
                    this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                    j++;
                    i++;
                    rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
                }
            }
            if (leftItemInRightSide && rightItemInLeftSide) {
                this.compare(leftItemInRightSide, rightItemInLeftSide);
                j++;
                i++;
            }
            looping = (i < leftSide.length || j < rightSide.length);
        }
    };
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    DifferentiateComponent.prototype.toInternalStruction = function (leftNode, rightNode) {
        var /** @type {?} */ result = {
            leftSide: this.transformNodeToInternalStruction(leftNode),
            rightSide: this.transformNodeToInternalStruction(rightNode)
        };
        this.unify(result.leftSide, result.rightSide);
        return result;
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    DifferentiateComponent.prototype.ngOnChanges = function (changes) {
        if (changes.leftSideObject) {
            this.ngOnInit();
        }
        if (changes.rightSideObject) {
            this.ngOnInit();
        }
    };
    /**
     * @return {?}
     */
    DifferentiateComponent.prototype.ngOnInit = function () {
        if (this.leftSideObject && this.rightSideObject) {
            var /** @type {?} */ comparision = this.toInternalStruction(this.leftSideObject, this.rightSideObject);
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DifferentiateComponent.prototype.onhover = function (event) {
        if (event.side == 'left-side') {
            this.rightSide[0].children[event.index].hover = event.hover;
        }
        else {
            this.leftSide[0].children[event.index].hover = event.hover;
        }
    };
    return DifferentiateComponent;
}());
DifferentiateComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'differentiate',
                template: "<differentiate-tree\n    class=\"root\"\n    level=\"0\"\n    side=\"left-side\"\n    (onhover)=\"onhover($event)\"\n    [children]=\"leftSide\"></differentiate-tree>\n<differentiate-tree\n    class=\"root\"\n    level=\"0\"\n    side=\"right-side\"\n    (onhover)=\"onhover($event)\"\n    [children]=\"rightSide\"></differentiate-tree>\n",
                styles: [":host{\n  border:1px solid #444;\n  -webkit-box-sizing:border-box;\n          box-sizing:border-box;\n  display:block;\n  max-width:100vw;\n  max-height:300px;\n  overflow-y:auto;\n  position:relative;\n  width:100%; }\n"],
            },] },
];
/** @nocollapse */
DifferentiateComponent.ctorParameters = function () { return []; };
DifferentiateComponent.propDecorators = {
    "leftSideObject": [{ type: core.Input, args: ["leftSideObject",] },],
    "rightSideObject": [{ type: core.Input, args: ["rightSideObject",] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DifferentiateTree = (function () {
    function DifferentiateTree() {
        this.onhover = new core.EventEmitter();
        this.level = "0";
    }
    /**
     * @return {?}
     */
    DifferentiateTree.prototype.ngOnInit = function () {
        this.depth = parseInt(this.level);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DifferentiateTree.prototype.bubleup = function (event) {
        event.side = this.side;
        this.onhover.emit(event);
    };
    /**
     * @param {?} flag
     * @param {?} i
     * @return {?}
     */
    DifferentiateTree.prototype.mouseOvered = function (flag, i) {
        if (this.depth === 1) {
            this.onhover.emit({
                hover: flag,
                index: i,
                side: this.side
            });
        }
    };
    return DifferentiateTree;
}());
DifferentiateTree.decorators = [
    { type: core.Component, args: [{
                selector: 'differentiate-tree',
                template: "<ul [class]=\"side\">\n  <li  *ngFor=\"let child of children\"\n    (mouseout)=\"mouseOvered(false, child.index)\"\n    (mouseover)=\"mouseOvered(true, child.index)\"\n    [class.hover]=\"child.hover\"\n    [class.added]=\"child.status === 5\"\n    [class.removed]=\"child.status === 6\"\n    [class.type-changed]=\"child.status === 2\"\n    [class.name-changed]=\"child.status === 3\"\n    [class.value-changed]=\"child.status === 4\">\n    <div class='tree-node'\n        [ngClass]=\"'depth-' + depth\"\n        [id] = \"child.id\">\n      <span *ngIf='child.name && child.name!=null'\n        class='name'\n        [innerHTML]=\"child.name.length ? child.name : '&nbsp;'\">\n      </span>\n      <span *ngIf='child.value && child.value!=null'\n        class='value'\n        [class.string]=\"depth > 0 && child.value && child.value.length\"\n        [innerHTML]=\"child.value ? child.value : '&nbsp;'\">\n      </span>\n    </div>\n    <differentiate-tree *ngIf=\"child.children.length\"\n        [level]=\"depth+1\"\n        (onhover)=\"bubleup($event)\"\n        [class.child-node]=\"child.parent != 4\"\n        [children]='child.children'></differentiate-tree>\n    <div class=\"upper\" *ngIf=\"child.status > 2\"></div>\n    <div class=\"lower\" *ngIf=\"child.status > 2\"></div>\n  </li>\n</ul>\n",
                styles: [":host{\n  -webkit-box-sizing:border-box;\n          box-sizing:border-box;\n  display:inline-block;\n  width:100%; }\n:host.root{\n  float:left;\n  width:50%; }\n:host.child-node{\n  float:left; }\nul{\n  -webkit-box-sizing:border-box;\n          box-sizing:border-box;\n  list-style:none;\n  padding:0;\n  width:100%; }\n  ul li .hover{\n    background-color:#ddd; }\n  ul.undefined li:hover{\n    background-color:#ddd; }\n  ul.left-side{\n    border-right:1px solid #444;\n    display:inline-block;\n    margin:0; }\n    ul.left-side li{\n      position:relative;\n      display:table;\n      width:100%; }\n      ul.left-side li.added .name, ul.left-side li.added .value{\n        opacity:0.2;\n        font-style:italic; }\n      ul.left-side li.added .upper{\n        border:1px solid #4a4;\n        border-top-width:0;\n        border-left-width:0;\n        border-radius:0 0 100% 0;\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:50%;\n        position:absolute;\n        pointer-events:none;\n        width:50%;\n        top:0;\n        right:0; }\n      ul.left-side li.added .lower{\n        border:1px solid #4a4;\n        border-bottom-width:0;\n        border-left-width:0;\n        border-radius:0 100% 0 0;\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:50%;\n        position:absolute;\n        pointer-events:none;\n        width:50%;\n        bottom:0;\n        right:0; }\n      ul.left-side li.removed .upper{\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:100%;\n        position:absolute;\n        width:66px;\n        top:0;\n        right:0;\n        pointer-events:none; }\n        ul.left-side li.removed .upper:after{\n          content:' - ';\n          color:#f00;\n          float:right;\n          padding-right:10px;\n          font-size:20px;\n          line-height:16px; }\n      ul.left-side li.removed .lower{\n        display:none; }\n      ul.left-side li.removed .tree-node span{\n        color:#f00; }\n      ul.left-side li.type-changed .tree-node span{\n        color:#f00; }\n      ul.left-side li.name-changed .upper{\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:100%;\n        position:absolute;\n        width:66px;\n        top:0;\n        right:0;\n        pointer-events:none; }\n        ul.left-side li.name-changed .upper:after{\n          content:' ~ ';\n          color:#00f;\n          font-weight:bold;\n          float:right;\n          padding-right:10px;\n          font-size:20px;\n          line-height:16px; }\n      ul.left-side li.name-changed .tree-node .name{\n        color:#00f; }\n      ul.left-side li.value-changed .upper{\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:100%;\n        position:absolute;\n        pointer-events:none;\n        width:66px;\n        top:0;\n        right:0; }\n        ul.left-side li.value-changed .upper:after{\n          content:' ~ ';\n          color:#00f;\n          font-weight:bold;\n          float:right;\n          padding-right:10px;\n          font-size:20px;\n          line-height:16px; }\n      ul.left-side li.value-changed .tree-node .value{\n        color:#00f; }\n  ul.right-side{\n    border-left:1px solid #444;\n    display:inline-block;\n    margin:0; }\n    ul.right-side li{\n      position:relative;\n      display:table;\n      width:100%; }\n      ul.right-side li.added .upper{\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:100%;\n        position:absolute;\n        pointer-events:none;\n        width:90%;\n        top:0;\n        left:0; }\n        ul.right-side li.added .upper:after{\n          content:'+';\n          color:#4a4;\n          font-weight:bold;\n          padding-left:5px;\n          font-size:20px;\n          line-height:16px; }\n      ul.right-side li.added .lower{\n        display:none; }\n      ul.right-side li.added .tree-node span{\n        color:#4a4; }\n      ul.right-side li.removed .name, ul.right-side li.removed .value{\n        -webkit-text-decoration-line:line-through;\n                text-decoration-line:line-through;\n        -webkit-text-decoration-color:#ff0600;\n                text-decoration-color:#ff0600; }\n      ul.right-side li.removed .upper{\n        border:1px solid #f00;\n        border-top-width:0;\n        border-right-width:0;\n        border-radius:0 0 0 100%;\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:50%;\n        width:10%;\n        position:absolute;\n        pointer-events:none;\n        top:0; }\n      ul.right-side li.removed .lower{\n        border:1px solid #f00;\n        border-bottom-width:0;\n        border-right-width:0;\n        border-radius:100% 0 0 0;\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:50%;\n        width:10%;\n        position:absolute;\n        pointer-events:none;\n        bottom:0; }\n      ul.right-side li.type-changed .tree-node span{\n        color:#f00; }\n      ul.right-side li.name-changed .upper{\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:100%;\n        position:absolute;\n        pointer-events:none;\n        top:0;\n        left:0; }\n        ul.right-side li.name-changed .upper:before{\n          content:' ~ ';\n          color:#00f;\n          font-weight:bold;\n          float:right;\n          padding-left:5px;\n          font-size:20px;\n          line-height:16px; }\n      ul.right-side li.name-changed .tree-node .name{\n        color:#00f; }\n      ul.right-side li.value-changed .upper{\n        -webkit-box-sizing:border-box;\n                box-sizing:border-box;\n        height:100%;\n        position:absolute;\n        pointer-events:none;\n        top:0;\n        left:0; }\n        ul.right-side li.value-changed .upper:before{\n          content:' ~ ';\n          color:#00f;\n          font-weight:bold;\n          float:right;\n          padding-left:5px;\n          font-size:20px;\n          line-height:16px; }\n      ul.right-side li.value-changed .tree-node .value{\n        color:#00f; }\n  ul .tree-node{\n    -webkit-box-sizing:border-box;\n            box-sizing:border-box;\n    color:#7c9eb2;\n    display:table;\n    padding:0;\n    position:relative;\n    margin:0;\n    width:100%; }\n    ul .tree-node.depth-0{\n      padding-left:5px; }\n    ul .tree-node.depth-1{\n      padding-left:20px; }\n    ul .tree-node.depth-2{\n      padding-left:40px; }\n    ul .tree-node.depth-3{\n      padding-left:60px; }\n    ul .tree-node.depth-4{\n      padding-left:80px; }\n    ul .tree-node.depth-5{\n      padding-left:100px; }\n    ul .tree-node.depth-6{\n      padding-left:120px; }\n    ul .tree-node.depth-7{\n      padding-left:140px; }\n    ul .tree-node.depth-8{\n      padding-left:160px; }\n    ul .tree-node.depth-9{\n      padding-left:180px; }\n    ul .tree-node.depth-10{\n      padding-left:200px; }\n    ul .tree-node .name{\n      color:#444;\n      font-weight:bold; }\n      ul .tree-node .name:after{\n        content:':'; }\n    ul .tree-node .value.string:before{\n      content:'\"'; }\n    ul .tree-node .value.string:after{\n      content:'\"'; }\n"],
            },] },
];
/** @nocollapse */
DifferentiateTree.ctorParameters = function () { return []; };
DifferentiateTree.propDecorators = {
    "onhover": [{ type: core.Output, args: ["onhover",] },],
    "children": [{ type: core.Input, args: ["children",] },],
    "side": [{ type: core.Input, args: ["side",] },],
    "level": [{ type: core.Input, args: ["level",] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DifferentiateModule = (function () {
    function DifferentiateModule() {
    }
    return DifferentiateModule;
}());
DifferentiateModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
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
                schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
            },] },
];
/** @nocollapse */
DifferentiateModule.ctorParameters = function () { return []; };

exports.DifferentiateComponent = DifferentiateComponent;
exports.DifferentiateTree = DifferentiateTree;
exports.DifferentiateModule = DifferentiateModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=differentiate.umd.js.map
