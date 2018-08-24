import { Component, Input, Output, EventEmitter, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

var DifferentiateNodeType = {
    literal: 1,
    pair: 2,
    json: 3,
    array: 4,
};
DifferentiateNodeType[DifferentiateNodeType.literal] = 'literal';
DifferentiateNodeType[DifferentiateNodeType.pair] = 'pair';
DifferentiateNodeType[DifferentiateNodeType.json] = 'json';
DifferentiateNodeType[DifferentiateNodeType.array] = 'array';
var DifferentiateNodeStatus = {
    default: 1,
    typeChanged: 2,
    nameChanged: 3,
    valueChanged: 4,
    added: 5,
    removed: 6,
};
DifferentiateNodeStatus[DifferentiateNodeStatus.default] = 'default';
DifferentiateNodeStatus[DifferentiateNodeStatus.typeChanged] = 'typeChanged';
DifferentiateNodeStatus[DifferentiateNodeStatus.nameChanged] = 'nameChanged';
DifferentiateNodeStatus[DifferentiateNodeStatus.valueChanged] = 'valueChanged';
DifferentiateNodeStatus[DifferentiateNodeStatus.added] = 'added';
DifferentiateNodeStatus[DifferentiateNodeStatus.removed] = 'removed';
var DifferentiateComponent = /** @class */ (function () {
    function DifferentiateComponent() {
        this.allowRevert = false;
        this.allowAdvance = false;
        this.attributeOrderIsImportant = true;
        this.onlyShowDifferences = false;
        this.leftSideToolTip = "take left side";
        this.rightSideToolTip = "take right side";
        this.onrevert = new EventEmitter();
        this.onadvance = new EventEmitter();
        this.ondifference = new EventEmitter();
    }
    DifferentiateComponent.prototype.generateNodeId = function () {
        var min = 1;
        var max = 10000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    DifferentiateComponent.prototype.transformNodeToOriginalStructure = function (node, parent) {
        var _this = this;
        var json = {};
        var array = [];
        node.map(function (item) {
            if (item.status !== DifferentiateNodeStatus.removed) {
                if (parent === DifferentiateNodeType.json) {
                    if (item.type === DifferentiateNodeType.literal) {
                        array.push(item.value);
                    }
                    else if (item.type === DifferentiateNodeType.pair) {
                        json[item.name] = item.value;
                    }
                    else if (item.type === DifferentiateNodeType.array) {
                        var x = _this.transformNodeToOriginalStructure(item.children, item.parent);
                        if (item.name.length) {
                            json[item.name] = x;
                        }
                        else {
                            json = [x];
                        }
                    }
                    else if (item.type === DifferentiateNodeType.json) {
                        json[item.name] = _this.transformNodeToOriginalStructure(item.children, item.parent);
                    }
                }
                else if (parent === DifferentiateNodeType.array) {
                    if (item.type === DifferentiateNodeType.literal) {
                        array.push(item.value);
                    }
                    else if (item.type === DifferentiateNodeType.json) {
                        array.push(_this.transformNodeToOriginalStructure(item, item.parent));
                    }
                    else if (item.type === DifferentiateNodeType.array) {
                        array.push(_this.transformNodeToOriginalStructure(item.children, item.parent));
                    }
                }
            }
        });
        return array.length ? array : json;
    };
    DifferentiateComponent.prototype.transformNodeToInternalStruction = function (node) {
        var _this = this;
        var result = node;
        if (node instanceof Array) {
            var children_1 = [];
            var p_1 = DifferentiateNodeType.array;
            node.map(function (item, i) {
                var jsonValue = _this.transformNodeToInternalStruction(item);
                if (jsonValue instanceof Array) {
                    if (!_this.attributeOrderIsImportant) {
                        jsonValue.sort(function (a, b) { return a.name <= b.name ? -1 : 1; });
                        jsonValue.map(function (x, i) {
                            x.index = i;
                            x.altName = "" + i;
                        });
                    }
                    children_1.push({
                        id: _this.generateNodeId(),
                        index: i,
                        name: "",
                        altName: "" + i,
                        value: "",
                        parent: p_1,
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
                        altName: "" + i,
                        value: jsonValue,
                        parent: p_1,
                        type: DifferentiateNodeType.literal,
                        status: DifferentiateNodeStatus.default,
                        children: []
                    });
                }
            });
            result = children_1;
        }
        else if (node instanceof Object) {
            var list = Object.keys(node);
            var children_2 = [];
            var p_2 = DifferentiateNodeType.json;
            if (!this.attributeOrderIsImportant) {
                list.sort(function (a, b) { return a <= b ? -1 : 1; });
            }
            list.map(function (item, i) {
                var jsonValue = _this.transformNodeToInternalStruction(node[item]);
                if (jsonValue instanceof Array) {
                    if (!_this.attributeOrderIsImportant) {
                        jsonValue.sort(function (a, b) { return a.name <= b.name ? -1 : 1; });
                        jsonValue.map(function (x, i) {
                            x.index = i;
                            x.altName = "" + i;
                        });
                    }
                    children_2.push({
                        id: _this.generateNodeId(),
                        index: i,
                        name: item,
                        altName: "" + i,
                        value: "",
                        parent: p_2,
                        type: DifferentiateNodeType.json,
                        status: DifferentiateNodeStatus.default,
                        children: jsonValue
                    });
                }
                else {
                    children_2.push({
                        id: _this.generateNodeId(),
                        index: i,
                        name: item,
                        altName: "" + i,
                        value: jsonValue,
                        parent: p_2,
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
    DifferentiateComponent.prototype.itemInArray = function (side, node) {
        var result;
        var key = node.type === DifferentiateNodeType.literal ?
            node.value.toUpperCase() :
            node.type === DifferentiateNodeType.array ?
                node.altName :
                node.name;
        side.map(function (item) {
            if (item.type === DifferentiateNodeType.literal) {
                if (item.value.toUpperCase() === key) {
                    result = item;
                }
            }
            else if (item.type === DifferentiateNodeType.array) {
                if (item.altName === key) {
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
    DifferentiateComponent.prototype.leftItemFromRightItem = function (leftNode, rightNode) {
        var result;
        if (!leftNode || !rightNode) {
            return result;
        }
        var key = rightNode.type === DifferentiateNodeType.literal ?
            rightNode.value.toUpperCase() :
            rightNode.type === DifferentiateNodeType.array ?
                rightNode.altName :
                rightNode.name;
        if (leftNode.type === DifferentiateNodeType.literal) {
            if (leftNode.value.toUpperCase() === key) {
                result = leftNode;
            }
        }
        else if (leftNode.type === DifferentiateNodeType.array) {
            if (leftNode.altName === key) {
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
    DifferentiateComponent.prototype.compare = function (leftNode, rightNode) {
        if (leftNode.type !== rightNode.type) {
            leftNode.status = DifferentiateNodeStatus.typeChanged;
            rightNode.status = DifferentiateNodeStatus.typeChanged;
            leftNode.counterpart = rightNode.id;
            rightNode.counterpart = leftNode.id;
        }
        else if (leftNode.type === DifferentiateNodeType.literal) {
            if (leftNode.value !== rightNode.value) {
                leftNode.status = DifferentiateNodeStatus.valueChanged;
                rightNode.status = DifferentiateNodeStatus.valueChanged;
                leftNode.counterpart = rightNode.id;
                rightNode.counterpart = leftNode.id;
            }
        }
        else if (leftNode.type === DifferentiateNodeType.pair) {
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
        }
        else {
            if (leftNode.name !== rightNode.name) {
                leftNode.status = DifferentiateNodeStatus.nameChanged;
                rightNode.status = DifferentiateNodeStatus.nameChanged;
                leftNode.counterpart = rightNode.id;
                rightNode.counterpart = leftNode.id;
            }
            this.unify(leftNode.children, rightNode.children);
        }
    };
    DifferentiateComponent.prototype.reIndex = function (list) {
        var _this = this;
        list.map(function (item, i) {
            item.index = i;
            _this.reIndex(item.children);
        });
    };
    DifferentiateComponent.prototype.copyInto = function (side, item, index, status) {
        var newItem = JSON.parse(JSON.stringify(item));
        side.splice(index, 0, newItem);
        this.reIndex(side);
        item.status = status;
        newItem.status = status;
        item.counterpart = newItem.id;
        newItem.counterpart = item.id;
        this.setChildrenStatus(item.children, status);
        this.setChildrenStatus(newItem.children, status);
    };
    DifferentiateComponent.prototype.setChildrenStatus = function (list, status) {
        var _this = this;
        list.map(function (x) {
            x.status = status;
            _this.setChildrenStatus(x.children, status);
        });
    };
    DifferentiateComponent.prototype.unify = function (leftSide, rightSide) {
        var i = 0;
        var j = 0;
        var looping = true;
        while (looping) {
            var leftItemInRightSide = i < leftSide.length ? this.itemInArray(rightSide, leftSide[i]) : undefined;
            var rightItemInLeftSide = j < rightSide.length ? this.itemInArray(leftSide, rightSide[j]) : undefined;
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
                var x = this.itemInArray(rightSide, leftSide[i]);
                if (x && x.index !== leftItemInRightSide.index) {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    j++;
                    i++;
                    leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                }
            }
            if (rightItemInLeftSide && j < rightSide.length) {
                var x = this.itemInArray(leftSide, rightSide[j]);
                if (x && x.index !== rightItemInLeftSide.index) {
                    this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                    j++;
                    i++;
                    rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
                }
            }
            if (leftItemInRightSide && rightItemInLeftSide) {
                if (leftItemInRightSide.parent !== rightItemInLeftSide.parent) {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                }
                else {
                    this.compare(leftItemInRightSide, rightItemInLeftSide);
                }
                j++;
                i++;
            }
            looping = (i < leftSide.length || j < rightSide.length);
        }
    };
    DifferentiateComponent.prototype.toInternalStruction = function (leftNode, rightNode) {
        var result = {
            leftSide: this.transformNodeToInternalStruction(leftNode),
            rightSide: this.transformNodeToInternalStruction(rightNode)
        };
        this.unify(result.leftSide, result.rightSide);
        if (this.onlyShowDifferences) {
            result.leftSide = this.filterUnchanged(result.leftSide);
            result.rightSide = this.filterUnchanged(result.rightSide);
        }
        return result;
    };
    DifferentiateComponent.prototype.filterUnchanged = function (list) {
        var _this = this;
        var result = [];
        list.map(function (item) {
            item.children = _this.filterUnchanged(item.children);
            if ((item.type > DifferentiateNodeType.pair && item.children.length) ||
                item.status !== DifferentiateNodeStatus.default) {
                result.push(item);
            }
        });
        result.map(function (x, i) {
            x.index = i;
            x.altName = "" + i;
        });
        return result;
    };
    DifferentiateComponent.prototype.ngOnChanges = function (changes) {
        if (changes.attributeOrderIsImportant ||
            changes.onlyShowDifferences ||
            changes.leftSideObject ||
            changes.rightSideObject) {
            this.ready = false;
            this.ngOnInit();
        }
    };
    DifferentiateComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () { return _this.init(); }, 666);
    };
    DifferentiateComponent.prototype.init = function () {
        var _this = this;
        if (this.leftSideObject && this.rightSideObject) {
            var comparision = this.toInternalStruction(this.leftSideObject, this.rightSideObject);
            this.leftSide = [{
                    id: this.generateNodeId(),
                    name: "",
                    value: "Root",
                    parent: DifferentiateNodeType.array,
                    type: DifferentiateNodeType.array,
                    expanded: true,
                    isRoot: true,
                    children: comparision.leftSide
                }];
            this.rightSide = [{
                    id: this.generateNodeId(),
                    name: "",
                    value: "Root",
                    parent: DifferentiateNodeType.array,
                    type: DifferentiateNodeType.array,
                    expanded: true,
                    isRoot: true,
                    children: comparision.rightSide
                }];
            setTimeout(function () {
                _this.ready = true;
                _this.fireCountDifference();
            }, 333);
        }
    };
    DifferentiateComponent.prototype.fireCountDifference = function () {
        var count = 0;
        this.leftSide[0].children.map(function (item) {
            if (item.status !== DifferentiateNodeStatus.default) {
                count++;
            }
        });
        this.ondifference.emit(count);
    };
    DifferentiateComponent.prototype.lookupChildOf = function (side, id) {
        var _this = this;
        var foundItem = undefined;
        if (side.children.length) {
            side.children.map(function (item) {
                if (!foundItem) {
                    foundItem = _this.lookupChildOf(item, id);
                    if (foundItem && foundItem.parent === undefined) {
                        foundItem.parent = side;
                    }
                    else if (item.id === id) {
                        foundItem = { parent: side, node: item };
                    }
                }
            });
        }
        else if (side.id === id) {
            foundItem = { parent: undefined, node: side };
        }
        return foundItem;
    };
    DifferentiateComponent.prototype.performAdvanceToRight = function (leftSideInfo, rightSideInfo, status) {
        var _this = this;
        if (status === DifferentiateNodeStatus.removed) {
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.added) {
            leftSideInfo.parent.children.splice(leftSideInfo.node.index, 1);
            rightSideInfo.parent.children.splice(rightSideInfo.node.index, 1);
            this.reIndex(leftSideInfo.parent.children);
            this.reIndex(rightSideInfo.parent.children);
        }
        else if (status === DifferentiateNodeStatus.nameChanged) {
            leftSideInfo.node.name = rightSideInfo.node.name;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.valueChanged) {
            rightSideInfo.node.value = leftSideInfo.node.value;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.typeChanged) {
            leftSideInfo.node.type = rightSideInfo.node.type;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            leftSideInfo.node.children = rightSideInfo.node.children;
        }
        setTimeout(function () {
            _this.onadvance.emit(_this.transformNodeToOriginalStructure(_this.leftSide[0].children, DifferentiateNodeType.json));
            _this.fireCountDifference();
        }, 66);
    };
    DifferentiateComponent.prototype.performAdvanceToLeft = function (leftSideInfo, rightSideInfo, status) {
        var _this = this;
        if (status === DifferentiateNodeStatus.added) {
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.removed) {
            leftSideInfo.parent.children.splice(leftSideInfo.node.index, 1);
            rightSideInfo.parent.children.splice(rightSideInfo.node.index, 1);
            this.reIndex(leftSideInfo.parent.children);
            this.reIndex(rightSideInfo.parent.children);
        }
        else if (status === DifferentiateNodeStatus.nameChanged) {
            rightSideInfo.node.name = leftSideInfo.node.name;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.valueChanged) {
            leftSideInfo.node.value = rightSideInfo.node.value;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.typeChanged) {
            rightSideInfo.node.type = leftSideInfo.node.type;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            rightSideInfo.node.children = leftSideInfo.node.children;
        }
        setTimeout(function () {
            _this.onrevert.emit(_this.transformNodeToOriginalStructure(_this.rightSide[0].children, DifferentiateNodeType.json));
            _this.fireCountDifference();
        }, 66);
    };
    DifferentiateComponent.prototype.advance = function (event) {
        if (event.type === 'advance') {
            this.performAdvanceToLeft(this.lookupChildOf(this.leftSide[0], event.node.id), this.lookupChildOf(this.rightSide[0], event.node.counterpart), event.node.status);
        }
        else {
            this.performAdvanceToRight(this.lookupChildOf(this.leftSide[0], event.node.counterpart), this.lookupChildOf(this.rightSide[0], event.node.id), event.node.status);
        }
    };
    DifferentiateComponent.prototype.onhover = function (event) {
        var children;
        if (event.side == 'left-side') {
            children = this.rightSide[0].children;
        }
        else {
            children = this.leftSide[0].children;
        }
        if (children.length > event.index) {
            children[event.index].hover = event.hover;
        }
    };
    return DifferentiateComponent;
}());
DifferentiateComponent.decorators = [
    { type: Component, args: [{
                selector: 'differentiate',
                template: "<div class=\"spinner\" *ngIf=\"!ready\">\n    <svg \n        version=\"1.1\" \n        id=\"loader\" \n        xmlns=\"http://www.w3.org/2000/svg\" \n        xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n        x=\"0px\" \n        y=\"0px\"\n        width=\"40px\" \n        height=\"40px\" \n        viewBox=\"0 0 50 50\" \n        style=\"enable-background:new 0 0 50 50;\" \n        xml:space=\"preserve\">\n        <path \n            fill=\"#000\" \n            d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\n            <animateTransform attributeType=\"xml\"\n                attributeName=\"transform\"\n                type=\"rotate\"\n                from=\"0 25 25\"\n                to=\"360 25 25\"\n                dur=\"0.6s\"\n                repeatCount=\"indefinite\"/>\n    </path>\n  </svg>\n</div>\n<differentiate-tree \n    *ngIf=\"leftSide && rightSide\"\n    class=\"root\" \n    level=\"0\" \n    side=\"left-side\" \n    (onhover)=\"onhover($event)\"\n    (onrevert)=\"advance($event)\"\n    [rightSideToolTip]=\"rightSideToolTip\"\n    [showLeftActionButton]=\"allowAdvance\" \n    [children]=\"leftSide\"></differentiate-tree>\n<differentiate-tree \n    *ngIf=\"leftSide && rightSide\"\n    class=\"root\" \n    level=\"0\" \n    side=\"right-side\" \n    (onhover)=\"onhover($event)\"\n    (onrevert)=\"advance($event)\"\n    [leftSideToolTip]=\"leftSideToolTip\"\n    [showRightActionButton]=\"allowRevert\" \n    [children]=\"rightSide\"></differentiate-tree>\n\n",
                styles: [":host{border:1px solid #444;-webkit-box-sizing:border-box;box-sizing:border-box;display:block;max-width:100vw;max-height:300px;min-height:100px;overflow-y:auto;position:relative;width:100%}:host .spinner{margin:0 auto 1em;height:100px;width:20%;text-align:center;padding:1em;display:inline-block;vertical-align:top;position:absolute;top:0;left:10%;z-index:2}:host svg path,:host svg rect{fill:#1c0696}"],
            },] },
];
DifferentiateComponent.ctorParameters = function () { return []; };
DifferentiateComponent.propDecorators = {
    allowRevert: [{ type: Input, args: ["allowRevert",] }],
    allowAdvance: [{ type: Input, args: ["allowAdvance",] }],
    attributeOrderIsImportant: [{ type: Input, args: ["attributeOrderIsImportant",] }],
    onlyShowDifferences: [{ type: Input, args: ["onlyShowDifferences",] }],
    leftSideObject: [{ type: Input, args: ["leftSideObject",] }],
    rightSideObject: [{ type: Input, args: ["rightSideObject",] }],
    leftSideToolTip: [{ type: Input, args: ["leftSideToolTip",] }],
    rightSideToolTip: [{ type: Input, args: ["rightSideToolTip",] }],
    onrevert: [{ type: Output, args: ["onrevert",] }],
    onadvance: [{ type: Output, args: ["onadvance",] }],
    ondifference: [{ type: Output, args: ["ondifference",] }]
};
var DifferentiateTree = /** @class */ (function () {
    function DifferentiateTree() {
        this.showLeftActionButton = false;
        this.showRightActionButton = false;
        this.status = 1;
        this.level = "0";
        this.leftSideToolTip = "take left side";
        this.rightSideToolTip = "take right side";
        this.onhover = new EventEmitter();
        this.onrevert = new EventEmitter();
    }
    DifferentiateTree.prototype.ngOnInit = function () {
        this.depth = parseInt(this.level);
    };
    DifferentiateTree.prototype.bubleup = function (event) {
        event.side = this.side;
        this.onhover.emit(event);
    };
    DifferentiateTree.prototype.keyup = function (event) {
        var code = event.which;
        if (code === 13) {
            event.target.click();
        }
    };
    DifferentiateTree.prototype.advanceToRightSide = function (child) {
        this.onrevert.emit({ type: "advance", node: child });
    };
    DifferentiateTree.prototype.advanceToLeftSide = function (child) {
        this.onrevert.emit({ type: "revert", node: child });
    };
    DifferentiateTree.prototype.advance = function (event) {
        this.onrevert.emit(event);
    };
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
    { type: Component, args: [{
                selector: 'differentiate-tree',
                template: "<ul [class]=\"side\">\n  <li  *ngFor=\"let child of children\" \n    (mouseout)=\"mouseOvered(false, child.index)\"\n    (mouseover)=\"mouseOvered(true, child.index)\"\n    [class.hover]=\"child.hover\"\n    [class.added]=\"child.status === 5\" \n    [class.removed]=\"child.status === 6\" \n    [class.type-changed]=\"child.status === 2\" \n    [class.name-changed]=\"child.status === 3\" \n    [class.value-changed]=\"child.status === 4\">\n    <div class='tree-node'\n        [ngClass]=\"'depth-' + depth\"\n        [id] = \"child.id\">\n      <span [title]=\"rightSideToolTip\"\n        class=\"do\" \n        tabindex=\"0\"\n        aria-hidden=\"true\"\n        (keyup)=\"keyup($event)\"\n        (click)=\"advanceToRightSide(child)\"\n        *ngIf=\"showLeftActionButton && status !== child.status && child.status > 1\">&#9100;</span>\n      <span *ngIf='child.name && child.name!=null'\n        class='name' \n        [innerHTML]=\"child.name.length ? child.name : '&nbsp;'\">\n      </span>\n      <span *ngIf='child.value && child.value!=null'\n        class='value' \n        [class.string]=\"depth > 0 && child.value && child.value.length\"\n        [innerHTML]=\"child.value ? child.value : '&nbsp;'\">\n      </span>\n      <span [title]=\"leftSideToolTip\"\n        class=\"undo\" \n        tabindex=\"0\"\n        aria-hidden=\"true\"\n        (keyup)=\"keyup($event)\"\n        (click)=\"advanceToLeftSide(child)\"\n        *ngIf=\"showRightActionButton && status !== child.status && child.status > 1\">&#9100;</span>\n    </div>\n    <differentiate-tree *ngIf=\"child.children.length\" \n        [level]=\"depth+1\" \n        [status]=\"child.status\" \n        [showLeftActionButton]=\"showLeftActionButton\" \n        [leftSideToolTip]=\"leftSideToolTip\"\n        [showRightActionButton]=\"showRightActionButton\" \n        [rightSideToolTip]=\"rightSideToolTip\"\n        (onhover)=\"bubleup($event)\"\n        (onrevert)=\"advance($event)\"\n        [class.child-node]=\"child.parent != 4\" \n        [children]='child.children'></differentiate-tree>\n    <div class=\"upper\" [ngClass]=\"'depth-' + depth\" *ngIf=\"child.status > 2\"></div>\n    <div class=\"lower\" [ngClass]=\"'depth-' + depth\" *ngIf=\"child.status > 2\"></div>\n  </li>\n</ul>\n\n",
                styles: [":host{-webkit-box-sizing:border-box;box-sizing:border-box;display:inline-block;width:100%}:host.root{float:left;width:50%}:host.child-node{float:left}ul{-webkit-box-sizing:border-box;box-sizing:border-box;list-style:none;padding:0;width:100%}ul li .hover{background-color:#ddd}ul li .tree-node{position:relative}ul li .tree-node.depth-0{display:none}ul li .tree-node .do,ul li .tree-node .undo{border-radius:50%;background-color:#ddd;cursor:pointer;color:#962323;font-size:1.2rem;height:18px;line-height:1.2rem;position:absolute;text-align:center;top:0;width:18px;z-index:2}ul li .tree-node .undo{right:0}ul li .tree-node .do{left:0}ul.undefined li:hover{background-color:#ddd}ul.left-side{border-right:1px solid #3a3636;display:inline-block;margin:0}ul.left-side li{position:relative;display:table;width:100%}ul.left-side li.added .name,ul.left-side li.added .value{opacity:.2;font-style:italic}ul.left-side li.added .upper{border-radius:0 0 100%;-webkit-box-sizing:border-box;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;top:0;right:0}ul.left-side li.added .upper.depth-1{border:2px solid #245024;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-2{border:2px dotted #378637;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-3{border:1px solid #48ad48;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-4{border:1px dotted #57d657;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-5{border:1px dashed #67fa67;border-top-width:0;border-left-width:0}ul.left-side li.added .lower{border-radius:0 100% 0 0;-webkit-box-sizing:border-box;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;bottom:0;right:0}ul.left-side li.added .lower.depth-1{border:2px solid #245024;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-2{border:2px dotted #378637;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-3{border:1px solid #48ad48;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-4{border:1px dotted #57d657;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-5{border:1px dashed #67fa67;border-bottom-width:0;border-left-width:0}ul.left-side li.removed .upper{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.removed .upper:after{content:' - ';color:#962323;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.removed .lower{display:none}ul.left-side li.removed .tree-node span,ul.left-side li.type-changed .tree-node span{color:#962323}ul.left-side li.name-changed .upper{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.name-changed .upper:after{content:' ~ ';color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.name-changed .tree-node .name{color:#000060}ul.left-side li.value-changed .upper{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:66px;top:0;right:0}ul.left-side li.value-changed .upper:after{content:' ~ ';color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.value-changed .tree-node .value{color:#000060}ul.right-side{border-left:1px solid #3a3636;display:inline-block;margin:0}ul.right-side li{position:relative;display:table;width:100%}ul.right-side li.added .upper{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:90%;top:0;left:0}ul.right-side li.added .upper:after{content:'+';color:#4a4;font-weight:700;padding-left:5px;font-size:1.2rem;line-height:1.2rem}ul.right-side li.added .lower{display:none}ul.right-side li.added .tree-node span{color:#4a4}ul.right-side li.removed .name,ul.right-side li.removed .value{-webkit-text-decoration-line:line-through;text-decoration-line:line-through;-webkit-text-decoration-color:#962323;text-decoration-color:#962323}ul.right-side li.removed .upper{border-radius:0 0 0 100%;-webkit-box-sizing:border-box;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;top:0}ul.right-side li.removed .upper.depth-1{border:2px solid #600000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-2{border:2px dotted maroon;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-3{border:1px solid #a00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-4{border:1px dotted #c00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-5{border:1px dashed #f00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .lower{border-radius:100% 0 0;-webkit-box-sizing:border-box;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;bottom:0}ul.right-side li.removed .lower.depth-1{border:2px solid #600000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-2{border:2px dotted maroon;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-3{border:1px solid #a00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-4{border:1px dotted #c00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-5{border:1px dashed #f00000;border-bottom-width:0;border-right-width:0}ul.right-side li.type-changed .tree-node span{color:#962323}ul.right-side li.name-changed .upper{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.name-changed .upper:before{content:' ~ ';color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.name-changed .tree-node .name{color:#000060}ul.right-side li.value-changed .upper{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.value-changed .upper:before{content:' ~ ';color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.value-changed .tree-node .value{color:#000060}ul .tree-node{-webkit-box-sizing:border-box;box-sizing:border-box;color:#7c9eb2;display:table;padding:0;position:relative;margin:0;width:100%}ul .tree-node.depth-0{padding-left:5px}ul .tree-node.depth-1{padding-left:20px}ul .tree-node.depth-2{padding-left:40px}ul .tree-node.depth-3{padding-left:60px}ul .tree-node.depth-4{padding-left:80px}ul .tree-node.depth-5{padding-left:100px}ul .tree-node.depth-6{padding-left:120px}ul .tree-node.depth-7{padding-left:140px}ul .tree-node.depth-8{padding-left:160px}ul .tree-node.depth-9{padding-left:180px}ul .tree-node.depth-10{padding-left:200px}ul .tree-node .name{color:#444;font-weight:700}ul .tree-node .name:after{content:':'}ul .tree-node .value.string:after,ul .tree-node .value.string:before{content:'\"'}"],
            },] },
];
DifferentiateTree.propDecorators = {
    children: [{ type: Input, args: ["children",] }],
    showLeftActionButton: [{ type: Input, args: ["showLeftActionButton",] }],
    showRightActionButton: [{ type: Input, args: ["showRightActionButton",] }],
    status: [{ type: Input, args: ["status",] }],
    side: [{ type: Input, args: ["side",] }],
    level: [{ type: Input, args: ["level",] }],
    leftSideToolTip: [{ type: Input, args: ["leftSideToolTip",] }],
    rightSideToolTip: [{ type: Input, args: ["rightSideToolTip",] }],
    onhover: [{ type: Output, args: ["onhover",] }],
    onrevert: [{ type: Output, args: ["onrevert",] }]
};
var DifferentiateModule = /** @class */ (function () {
    function DifferentiateModule() {
    }
    return DifferentiateModule;
}());
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

export { DifferentiateComponent, DifferentiateTree, DifferentiateModule };
//# sourceMappingURL=differentiate.js.map
