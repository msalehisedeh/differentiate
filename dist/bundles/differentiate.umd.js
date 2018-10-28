(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('differentiate', ['exports', '@angular/core', '@angular/common'], factory) :
    (factory((global.differentiate = {}),global.ng.core,global.ng.common));
}(this, (function (exports,core,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @enum {number} */
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
    /** @enum {number} */
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DifferentiateComponent = (function () {
        function DifferentiateComponent() {
            this.allowRevert = false;
            this.allowAdvance = false;
            this.attributeOrderIsImportant = true;
            this.onlyShowDifferences = false;
            this.leftSideToolTip = "take left side";
            this.rightSideToolTip = "take right side";
            this.onrevert = new core.EventEmitter();
            this.onadvance = new core.EventEmitter();
            this.ondifference = new core.EventEmitter();
        }
        Object.defineProperty(DifferentiateComponent.prototype, "namedRootObject", {
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                /** @type {?} */
                var x = value.replace(" ", "");
                if (x.length) {
                    this.categorizeBy = value.split(",");
                }
                else {
                    this.categorizeBy = undefined;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        DifferentiateComponent.prototype.generateNodeId = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var min = 1;
                /** @type {?} */
                var max = 10000;
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
        /**
         * @param {?} node
         * @param {?} parent
         * @return {?}
         */
        DifferentiateComponent.prototype.transformNodeToOriginalStructure = /**
         * @param {?} node
         * @param {?} parent
         * @return {?}
         */
            function (node, parent) {
                var _this = this;
                /** @type {?} */
                var json = {};
                /** @type {?} */
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
                                /** @type {?} */
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
        /**
         * @param {?} node
         * @return {?}
         */
        DifferentiateComponent.prototype.transformNodeToInternalStruction = /**
         * @param {?} node
         * @return {?}
         */
            function (node) {
                var _this = this;
                /** @type {?} */
                var result = node;
                if (node instanceof Array) {
                    /** @type {?} */
                    var children_1 = [];
                    /** @type {?} */
                    var p_1 = DifferentiateNodeType.array;
                    node.map(function (item, i) {
                        /** @type {?} */
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
                    /** @type {?} */
                    var list = Object.keys(node);
                    /** @type {?} */
                    var children_2 = [];
                    /** @type {?} */
                    var p_2 = DifferentiateNodeType.json;
                    if (!this.attributeOrderIsImportant) {
                        list.sort(function (a, b) { return a <= b ? -1 : 1; });
                    }
                    list.map(function (item, i) {
                        /** @type {?} */
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
        /**
         * @param {?} side
         * @param {?} node
         * @return {?}
         */
        DifferentiateComponent.prototype.itemInArray = /**
         * @param {?} side
         * @param {?} node
         * @return {?}
         */
            function (side, node) {
                /** @type {?} */
                var result;
                /** @type {?} */
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
        /**
         * @param {?} leftNode
         * @param {?} rightNode
         * @return {?}
         */
        DifferentiateComponent.prototype.leftItemFromRightItem = /**
         * @param {?} leftNode
         * @param {?} rightNode
         * @return {?}
         */
            function (leftNode, rightNode) {
                /** @type {?} */
                var result;
                if (!leftNode || !rightNode) {
                    return result;
                }
                /** @type {?} */
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
        /**
         * @param {?} leftNode
         * @param {?} rightNode
         * @return {?}
         */
        DifferentiateComponent.prototype.compare = /**
         * @param {?} leftNode
         * @param {?} rightNode
         * @return {?}
         */
            function (leftNode, rightNode) {
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
        /**
         * @param {?} list
         * @return {?}
         */
        DifferentiateComponent.prototype.reIndex = /**
         * @param {?} list
         * @return {?}
         */
            function (list) {
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
        DifferentiateComponent.prototype.copyInto = /**
         * @param {?} side
         * @param {?} item
         * @param {?} index
         * @param {?} status
         * @return {?}
         */
            function (side, item, index, status) {
                /** @type {?} */
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
        /**
         * @param {?} list
         * @param {?} status
         * @return {?}
         */
        DifferentiateComponent.prototype.setChildrenStatus = /**
         * @param {?} list
         * @param {?} status
         * @return {?}
         */
            function (list, status) {
                var _this = this;
                list.map(function (x) {
                    x.status = status;
                    _this.setChildrenStatus(x.children, status);
                });
            };
        /**
         * @param {?} leftSide
         * @param {?} rightSide
         * @return {?}
         */
        DifferentiateComponent.prototype.unify = /**
         * @param {?} leftSide
         * @param {?} rightSide
         * @return {?}
         */
            function (leftSide, rightSide) {
                /** @type {?} */
                var i = 0;
                /** @type {?} */
                var j = 0;
                /** @type {?} */
                var looping = true;
                while (looping) {
                    /** @type {?} */
                    var leftItemInRightSide = i < leftSide.length ? this.itemInArray(rightSide, leftSide[i]) : undefined;
                    /** @type {?} */
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
                        /** @type {?} */
                        var x = this.itemInArray(rightSide, leftSide[i]);
                        if (x && x.index !== leftItemInRightSide.index) {
                            this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                            j++;
                            i++;
                            leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                        }
                    }
                    if (rightItemInLeftSide && j < rightSide.length) {
                        /** @type {?} */
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
        /**
         * @param {?} leftNode
         * @param {?} rightNode
         * @return {?}
         */
        DifferentiateComponent.prototype.toInternalStruction = /**
         * @param {?} leftNode
         * @param {?} rightNode
         * @return {?}
         */
            function (leftNode, rightNode) {
                /** @type {?} */
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
        /**
         * @param {?} list
         * @return {?}
         */
        DifferentiateComponent.prototype.filterUnchanged = /**
         * @param {?} list
         * @return {?}
         */
            function (list) {
                var _this = this;
                /** @type {?} */
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
        /**
         * @param {?} changes
         * @return {?}
         */
        DifferentiateComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes.attributeOrderIsImportant ||
                    changes.onlyShowDifferences ||
                    changes.leftSideObject ||
                    changes.namedRootObject ||
                    changes.rightSideObject) {
                    this.ready = false;
                    this.ngOnInit();
                }
            };
        /**
         * @return {?}
         */
        DifferentiateComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                setTimeout(function () { return _this.init(); }, 666);
            };
        /**
         * @param {?} item
         * @return {?}
         */
        DifferentiateComponent.prototype.categorizedName = /**
         * @param {?} item
         * @return {?}
         */
            function (item) {
                /** @type {?} */
                var name = "";
                this.categorizeBy.map(function (category) {
                    if (item.name === category) {
                        name = item.value;
                    }
                });
                return name;
            };
        /**
         * @param {?} side
         * @return {?}
         */
        DifferentiateComponent.prototype.sideCategorizedName = /**
         * @param {?} side
         * @return {?}
         */
            function (side) {
                var _this = this;
                side.map(function (item) {
                    /** @type {?} */
                    var names = [];
                    item.children.map(function (child) {
                        /** @type {?} */
                        var name = _this.categorizedName(child);
                        if (String(name).length) {
                            names.push(name);
                        }
                    });
                    item.categorizeBy = names.length > 1 ? names.join(" - ") : names[0];
                    item.collapsed = true;
                });
            };
        /**
         * @return {?}
         */
        DifferentiateComponent.prototype.init = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.leftSideObject && this.rightSideObject) {
                    /** @type {?} */
                    var left = (this.leftSideObject instanceof Array) ? this.leftSideObject : [this.leftSideObject];
                    /** @type {?} */
                    var right = (this.rightSideObject instanceof Array) ? this.rightSideObject : [this.rightSideObject];
                    /** @type {?} */
                    var comparision = this.toInternalStruction(left, right);
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
                    this.rightSide = [{
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
                    setTimeout(function () {
                        _this.ready = true;
                        _this.fireCountDifference();
                    }, 333);
                }
            };
        /**
         * @return {?}
         */
        DifferentiateComponent.prototype.fireCountDifference = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var count = 0;
                this.leftSide[0].children.map(function (listItem) {
                    listItem.children.map(function (item) {
                        if (item.status !== DifferentiateNodeStatus.default) {
                            count++;
                        }
                    });
                });
                this.ondifference.emit(count);
            };
        /**
         * @param {?} side
         * @param {?} parentObject
         * @param {?} id
         * @return {?}
         */
        DifferentiateComponent.prototype.lookupChildOf = /**
         * @param {?} side
         * @param {?} parentObject
         * @param {?} id
         * @return {?}
         */
            function (side, parentObject, id) {
                var _this = this;
                /** @type {?} */
                var foundItem = undefined;
                if (side.id === id) {
                    foundItem = { parent: parentObject, node: side };
                }
                else if (side.children.length) {
                    side.children.map(function (item) {
                        if (!foundItem) {
                            foundItem = _this.lookupChildOf(item, undefined, id);
                            if (foundItem && foundItem.parent === undefined) {
                                foundItem.parent = side;
                            }
                            else if (item.id === id) {
                                foundItem = { parent: side, node: item };
                            }
                        }
                    });
                }
                return foundItem;
            };
        /**
         * @param {?} leftSideInfo
         * @param {?} rightSideInfo
         * @param {?} status
         * @param {?} i
         * @return {?}
         */
        DifferentiateComponent.prototype.performAdvanceToRight = /**
         * @param {?} leftSideInfo
         * @param {?} rightSideInfo
         * @param {?} status
         * @param {?} i
         * @return {?}
         */
            function (leftSideInfo, rightSideInfo, status, i) {
                var _this = this;
                /** @type {?} */
                var modifiedChildren = this.leftSide[0].children[i].children;
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
                    _this.onadvance.emit({
                        index: i,
                        node: _this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
                    });
                    _this.fireCountDifference();
                }, 66);
            };
        /**
         * @param {?} leftSideInfo
         * @param {?} rightSideInfo
         * @param {?} status
         * @param {?} i
         * @return {?}
         */
        DifferentiateComponent.prototype.performAdvanceToLeft = /**
         * @param {?} leftSideInfo
         * @param {?} rightSideInfo
         * @param {?} status
         * @param {?} i
         * @return {?}
         */
            function (leftSideInfo, rightSideInfo, status, i) {
                var _this = this;
                /** @type {?} */
                var modifiedChildren = this.rightSide[0].children[i].children;
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
                    _this.onrevert.emit({
                        index: i,
                        node: _this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
                    });
                    _this.fireCountDifference();
                }, 66);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DifferentiateComponent.prototype.advance = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                /** @type {?} */
                var index = parseInt(event.node.path.split(",")[1]);
                if (event.type === 'advance') {
                    this.performAdvanceToLeft(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.id), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.counterpart), event.node.status, index);
                }
                else {
                    this.performAdvanceToRight(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.counterpart), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.id), event.node.status, index);
                }
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DifferentiateComponent.prototype.autoExpand = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                /** @type {?} */
                var index = parseInt(event.split(",")[1]);
                /** @type {?} */
                var lc = this.rightSide[0].children[index];
                /** @type {?} */
                var rc = this.leftSide[0].children[index];
                lc.collapsed = !lc.collapsed;
                rc.collapsed = !rc.collapsed;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DifferentiateComponent.prototype.onhover = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                /** @type {?} */
                var index = parseInt(event.path.split(",")[1]);
                this.rightSide[0].children[index].children[event.index].hover = event.hover;
                this.leftSide[0].children[index].children[event.index].hover = event.hover;
            };
        DifferentiateComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'differentiate',
                        template: "<div class=\"spinner\" *ngIf=\"!ready\">\r\n    <svg \r\n        version=\"1.1\" \r\n        id=\"loader\" \r\n        xmlns=\"http://www.w3.org/2000/svg\" \r\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\" \r\n        x=\"0px\" \r\n        y=\"0px\"\r\n        width=\"40px\" \r\n        height=\"40px\" \r\n        viewBox=\"0 0 50 50\" \r\n        style=\"enable-background:new 0 0 50 50;\" \r\n        xml:space=\"preserve\">\r\n        <path \r\n            fill=\"#000\" \r\n            d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\r\n            <animateTransform attributeType=\"xml\"\r\n                attributeName=\"transform\"\r\n                type=\"rotate\"\r\n                from=\"0 25 25\"\r\n                to=\"360 25 25\"\r\n                dur=\"0.6s\"\r\n                repeatCount=\"indefinite\"/>\r\n    </path>\r\n  </svg>\r\n</div>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"left-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [rightSideToolTip]=\"rightSideToolTip\"\r\n    [showLeftActionButton]=\"allowAdvance\" \r\n    [children]=\"leftSide\"></differentiate-tree>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"right-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [leftSideToolTip]=\"leftSideToolTip\"\r\n    [showRightActionButton]=\"allowRevert\" \r\n    [children]=\"rightSide\"></differentiate-tree>\r\n\r\n",
                        styles: [":host{border:1px solid rgba(0,0,0,.1);box-sizing:border-box;display:block;max-width:100vw;max-height:300px;overflow-y:auto;position:relative;width:100%}:host .spinner{margin:0 auto 1em;height:222px;width:20%;text-align:center;padding:1em;display:inline-block;vertical-align:top;position:absolute;top:0;left:10%;z-index:2}:host svg path,:host svg rect{fill:#1c0696}"]
                    }] }
        ];
        /** @nocollapse */
        DifferentiateComponent.ctorParameters = function () { return []; };
        DifferentiateComponent.propDecorators = {
            allowRevert: [{ type: core.Input, args: ["allowRevert",] }],
            allowAdvance: [{ type: core.Input, args: ["allowAdvance",] }],
            attributeOrderIsImportant: [{ type: core.Input, args: ["attributeOrderIsImportant",] }],
            onlyShowDifferences: [{ type: core.Input, args: ["onlyShowDifferences",] }],
            leftSideObject: [{ type: core.Input, args: ["leftSideObject",] }],
            rightSideObject: [{ type: core.Input, args: ["rightSideObject",] }],
            leftSideToolTip: [{ type: core.Input, args: ["leftSideToolTip",] }],
            rightSideToolTip: [{ type: core.Input, args: ["rightSideToolTip",] }],
            namedRootObject: [{ type: core.Input, args: ['namedRootObject',] }],
            onrevert: [{ type: core.Output, args: ["onrevert",] }],
            onadvance: [{ type: core.Output, args: ["onadvance",] }],
            ondifference: [{ type: core.Output, args: ["ondifference",] }]
        };
        return DifferentiateComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DifferentiateTree = (function () {
        function DifferentiateTree() {
            this.collapsed = true;
            this.showLeftActionButton = false;
            this.showRightActionButton = false;
            this.status = 1;
            this.side = "";
            this.level = "0";
            this.objectPath = "";
            this.leftSideToolTip = "take left side";
            this.rightSideToolTip = "take right side";
            this.onhover = new core.EventEmitter();
            this.onrevert = new core.EventEmitter();
            this.onexpand = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        DifferentiateTree.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.depth = parseInt(this.level);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DifferentiateTree.prototype.bubleup = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                event.side = this.side;
                this.onhover.emit(event);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DifferentiateTree.prototype.keyup = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                /** @type {?} */
                var code = event.which;
                if (code === 13) {
                    event.target.click();
                }
            };
        /**
         * @return {?}
         */
        DifferentiateTree.prototype.changCounter = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var count = 0;
                this.children.map(function (item) {
                    if (item.status !== DifferentiateNodeStatus.default) {
                        count++;
                    }
                });
                return count;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DifferentiateTree.prototype.expand = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.onexpand.emit(this.objectPath);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DifferentiateTree.prototype.autoExpand = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.onexpand.emit(event);
            };
        /**
         * @param {?} child
         * @return {?}
         */
        DifferentiateTree.prototype.advanceToRightSide = /**
         * @param {?} child
         * @return {?}
         */
            function (child) {
                child.path = this.objectPath + (this.objectPath.length ? ',' : '') + child.index;
                this.onrevert.emit({ type: "advance", node: child });
            };
        /**
         * @param {?} child
         * @return {?}
         */
        DifferentiateTree.prototype.advanceToLeftSide = /**
         * @param {?} child
         * @return {?}
         */
            function (child) {
                child.path = this.objectPath + (this.objectPath.length ? ',' : '') + child.index;
                this.onrevert.emit({ type: "revert", node: child });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DifferentiateTree.prototype.advance = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                // bubble up the undo event.
                this.onrevert.emit(event);
            };
        /**
         * @param {?} event
         * @param {?} flag
         * @param {?} i
         * @return {?}
         */
        DifferentiateTree.prototype.mouseOvered = /**
         * @param {?} event
         * @param {?} flag
         * @param {?} i
         * @return {?}
         */
            function (event, flag, i) {
                event.preventDefault();
                if (this.depth === 2) {
                    event.stopPropagation();
                    this.onhover.emit({
                        hover: flag,
                        index: i,
                        path: this.objectPath
                    });
                }
            };
        DifferentiateTree.decorators = [
            { type: core.Component, args: [{
                        selector: 'differentiate-tree',
                        template: "<div *ngIf=\"categorizeBy\" \r\n  class=\"diff-heading\" \r\n  (click)=\"expand($event)\">\r\n  <span class=\"arrow\" *ngIf=\"collapsed\">&#9658;</span>\r\n  <span class=\"arrow\" *ngIf=\"!collapsed\">&#9660;</span>\r\n  <span [textContent]=\"categorizeBy\"></span>\r\n  <span class=\"counter\" [textContent]=\"changCounter()\"></span>\r\n</div>\r\n<ul [class]=\"side\" [class.child]=\"depth ===2 || (categorizeBy && categorizeBy.length)\" [class.collapsed]=\"categorizeBy && collapsed\">\r\n  <li  *ngFor=\"let child of children\" \r\n    (mouseout)=\"depth === 2 ? mouseOvered($event, false, child.index) : null\"\r\n    (mouseover)=\"depth === 2 ? mouseOvered($event, true, child.index) : null\"\r\n    [class.hover]=\"child.hover\"\r\n    [class.added]=\"child.status === 5\" \r\n    [class.removed]=\"child.status === 6\" \r\n    [class.type-changed]=\"child.status === 2\" \r\n    [class.name-changed]=\"child.status === 3\" \r\n    [class.value-changed]=\"child.status === 4\">\r\n    <div class='tree-node' [ngClass]=\"'depth-' + depth\" [class.collapsed]=\"child.collapsed\" [id] = \"child.id\">\r\n      <span [title]=\"rightSideToolTip\"\r\n        class=\"do\" \r\n        tabindex=\"0\"\r\n        aria-hidden=\"true\"\r\n        (keyup)=\"keyup($event)\"\r\n        (click)=\"advanceToRightSide(child)\"\r\n        *ngIf=\"showLeftActionButton && status !== child.status && child.status > 1\">&#9100;</span>\r\n      <span *ngIf='child.name && child.name!=null'\r\n        class='name' \r\n        [innerHTML]=\"child.name.length ? child.name : '&nbsp;'\">\r\n      </span>\r\n      <span *ngIf='child.value && child.value!=null'\r\n        class='value' \r\n        [class.string]=\"depth > 0 && child.value && child.value.length\"\r\n        [innerHTML]=\"child.value ? child.value : '&nbsp;'\">\r\n      </span>\r\n      <span [title]=\"leftSideToolTip\"\r\n        class=\"undo\" \r\n        tabindex=\"0\"\r\n        aria-hidden=\"true\"\r\n        (keyup)=\"keyup($event)\"\r\n        (click)=\"advanceToLeftSide(child)\"\r\n        *ngIf=\"showRightActionButton && status !== child.status && child.status > 1\">&#9100;</span>\r\n    </div>\r\n    <differentiate-tree *ngIf=\"child.children.length\" \r\n        [level]=\"depth+1\" \r\n        [status]=\"child.status\" \r\n        [collapsed]=\"child.collapsed\"\r\n        [categorizeBy]=\"child.categorizeBy\"\r\n        [showLeftActionButton]=\"showLeftActionButton\" \r\n        [leftSideToolTip]=\"leftSideToolTip\"\r\n        [showRightActionButton]=\"showRightActionButton\" \r\n        [rightSideToolTip]=\"rightSideToolTip\"\r\n        [objectPath]=\"objectPath + (objectPath.length ? ',':'') + child.index\"\r\n        (onhover)=\"bubleup($event)\"\r\n        (onrevert)=\"advance($event)\"\r\n        (onexpand)=\"autoExpand($event)\"\r\n        [class.child-node]=\"child.parent != 4\" \r\n        [children]='child.children'></differentiate-tree>\r\n    <div *ngIf=\"child.status > 2\" class=\"upper\" [class.collapsed]=\"child.collapsed\" [ngClass]=\"'depth-' + depth\" ></div>\r\n    <div *ngIf=\"child.status > 2\" class=\"lower\" [class.collapsed]=\"child.collapsed\" [ngClass]=\"'depth-' + depth\" ></div>\r\n  </li>\r\n</ul>\r\n\r\n",
                        styles: [":host{box-sizing:border-box;width:100%}:host.root{float:left;width:50%}:host.child-node{float:left}.diff-heading{padding:5px;font-weight:700;background:rgba(0,0,0,.02);border-bottom:1px solid rgba(0,0,0,.1);color:#666;cursor:pointer}.diff-heading .arrow{color:#999;font-size:.6rem;font-weight:700}.diff-heading .counter{float:right;border-radius:50%;width:16px;text-align:center;background-color:rgba(0,0,0,.4);font-size:.8rem;color:#fff}.diff-heading:first-child{border-top:1px solid rgba(0,0,0,.1)}ul{box-sizing:border-box;list-style:none;padding:0;width:100%}ul .collapsed,ul.collapsed{display:none!important}ul li .hover{background-color:rgba(0,0,0,.1)}ul li .tree-node{position:relative}ul li .tree-node.depth-0{display:none}ul li .tree-node .do,ul li .tree-node .undo{border-radius:50%;background-color:#ddd;cursor:pointer;color:#962323;font-size:1.2rem;height:18px;line-height:1.2rem;position:absolute;text-align:center;top:0;width:18px;z-index:2}ul li .tree-node .undo{right:0}ul li .tree-node .do{left:0}ul.undefined li:hover{background-color:rgba(0,0,0,.1)}ul.left-side{border-right:1px solid rgba(0,0,0,.1);margin:0}ul.left-side li{position:relative;display:table;width:100%}ul.left-side li.added .name,ul.left-side li.added .value{opacity:.2;font-style:italic}ul.left-side li.added .upper{border-radius:0 0 100%;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;top:0;right:0}ul.left-side li.added .upper.depth-1{border:2px solid #245024;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-2{border:2px dotted #378637;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-3{border:1px solid #48ad48;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-4{border:1px dotted #57d657;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-5{border:1px dashed #67fa67;border-top-width:0;border-left-width:0}ul.left-side li.added .lower{border-radius:0 100% 0 0;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;bottom:0;right:0}ul.left-side li.added .lower.depth-1{border:2px solid #245024;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-2{border:2px dotted #378637;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-3{border:1px solid #48ad48;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-4{border:1px dotted #57d657;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-5{border:1px dashed #67fa67;border-bottom-width:0;border-left-width:0}ul.left-side li.removed .upper{box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.removed .upper:after{content:' - ';color:#962323;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.removed .lower{display:none}ul.left-side li.removed .tree-node span,ul.left-side li.type-changed .tree-node span{color:#962323}ul.left-side li.name-changed .upper{box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.name-changed .upper:after{content:' ~ ';color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.name-changed .tree-node .name{color:#000060}ul.left-side li.value-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:66px;top:0;right:0}ul.left-side li.value-changed .upper:after{content:' ~ ';color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.value-changed .tree-node .value{color:#000060}ul.right-side{border-left:1px solid rgba(0,0,0,.1);margin:0}ul.right-side li{position:relative;display:table;width:100%}ul.right-side li.added .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:90%;top:0;left:0}ul.right-side li.added .upper:after{content:'+';color:#4a4;font-weight:700;padding-left:5px;font-size:1.2rem;line-height:1.2rem}ul.right-side li.added .lower{display:none}ul.right-side li.added .tree-node span{color:#4a4}ul.right-side li.removed .name,ul.right-side li.removed .value{-webkit-text-decoration-line:line-through;text-decoration-line:line-through;-webkit-text-decoration-color:#962323;text-decoration-color:#962323}ul.right-side li.removed .upper{border-radius:0 0 0 100%;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;top:0}ul.right-side li.removed .upper.depth-1{border:2px solid #600000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-2{border:2px dotted maroon;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-3{border:1px solid #a00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-4{border:1px dotted #c00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-5{border:1px dashed #f00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .lower{border-radius:100% 0 0;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;bottom:0}ul.right-side li.removed .lower.depth-1{border:2px solid #600000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-2{border:2px dotted maroon;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-3{border:1px solid #a00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-4{border:1px dotted #c00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-5{border:1px dashed #f00000;border-bottom-width:0;border-right-width:0}ul.right-side li.type-changed .tree-node span{color:#962323}ul.right-side li.name-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.name-changed .upper:before{content:' ~ ';color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.name-changed .tree-node .name{color:#000060}ul.right-side li.value-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.value-changed .upper:before{content:' ~ ';color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.value-changed .tree-node .value{color:#000060}ul.child{margin-top:2px!important}ul.child li{padding-top:2px;padding-bottom:2px}ul .tree-node{box-sizing:border-box;color:#7c9eb2;display:table;padding:0;position:relative;margin:0;width:100%}ul .tree-node.depth-0{padding-left:5px}ul .tree-node.depth-1{padding-left:20px}ul .tree-node.depth-2{padding-left:40px}ul .tree-node.depth-3{padding-left:60px}ul .tree-node.depth-4{padding-left:80px}ul .tree-node.depth-5{padding-left:100px}ul .tree-node.depth-6{padding-left:120px}ul .tree-node.depth-7{padding-left:140px}ul .tree-node.depth-8{padding-left:160px}ul .tree-node.depth-9{padding-left:180px}ul .tree-node.depth-10{padding-left:200px}ul .tree-node .name{color:#444;font-weight:700}ul .tree-node .name:after{content:':'}ul .tree-node .value.string:after,ul .tree-node .value.string:before{content:'\"'}"]
                    }] }
        ];
        DifferentiateTree.propDecorators = {
            collapsed: [{ type: core.Input, args: ["collapsed",] }],
            children: [{ type: core.Input, args: ["children",] }],
            showLeftActionButton: [{ type: core.Input, args: ["showLeftActionButton",] }],
            showRightActionButton: [{ type: core.Input, args: ["showRightActionButton",] }],
            status: [{ type: core.Input, args: ["status",] }],
            side: [{ type: core.Input, args: ["side",] }],
            level: [{ type: core.Input, args: ["level",] }],
            objectPath: [{ type: core.Input, args: ["objectPath",] }],
            categorizeBy: [{ type: core.Input, args: ["categorizeBy",] }],
            leftSideToolTip: [{ type: core.Input, args: ["leftSideToolTip",] }],
            rightSideToolTip: [{ type: core.Input, args: ["rightSideToolTip",] }],
            onhover: [{ type: core.Output, args: ["onhover",] }],
            onrevert: [{ type: core.Output, args: ["onrevert",] }],
            onexpand: [{ type: core.Output, args: ["onexpand",] }]
        };
        return DifferentiateTree;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DifferentiateModule = (function () {
        function DifferentiateModule() {
        }
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
                    },] }
        ];
        return DifferentiateModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.DifferentiateComponent = DifferentiateComponent;
    exports.DifferentiateTree = DifferentiateTree;
    exports.DifferentiateModule = DifferentiateModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL2RpZmZlcmVudGlhdGUvc3JjL2FwcC9kaWZmZXJlbnRpYXRlL2ludGVyZmFjZXMvZGlmZmVyZW50aWF0ZS5pbnRlcmZhY2VzLnRzIiwibmc6Ly9kaWZmZXJlbnRpYXRlL3NyYy9hcHAvZGlmZmVyZW50aWF0ZS9jb21wb25lbnRzL2RpZmZlcmVudGlhdGUuY29tcG9uZW50LnRzIiwibmc6Ly9kaWZmZXJlbnRpYXRlL3NyYy9hcHAvZGlmZmVyZW50aWF0ZS9jb21wb25lbnRzL2RpZmZlcmVudGlhdGUtdHJlZS5jb21wb25lbnQudHMiLCJuZzovL2RpZmZlcmVudGlhdGUvc3JjL2FwcC9kaWZmZXJlbnRpYXRlL2RpZmZlcmVudGlhdGUubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5leHBvcnQgZW51bSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUge1xyXG4gIGxpdGVyYWwgPSAxLFxyXG4gIHBhaXIgPSAyLFxyXG4gIGpzb24gPSAzLFxyXG4gIGFycmF5ID0gNFxyXG59XHJcbmV4cG9ydCBlbnVtIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzIHtcclxuICBkZWZhdWx0ID0gMSxcclxuICB0eXBlQ2hhbmdlZCA9IDIsXHJcbiAgbmFtZUNoYW5nZWQgPSAzLFxyXG4gIHZhbHVlQ2hhbmdlZCA9IDQsXHJcbiAgYWRkZWQgPSA1LFxyXG4gIHJlbW92ZWQgPSA2XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBEaWZmZXJlbnRpYXRlTm9kZSB7XHJcbiAgaWQ6IG51bWJlcixcclxuICBjb3VudGVycGFydD86IG51bWJlcixcclxuICBpbmRleDogbnVtYmVyLFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBhbHROYW1lOiBzdHJpbmcsXHJcbiAgdmFsdWU6IHN0cmluZyxcclxuICBwYXJlbnQ6IERpZmZlcmVudGlhdGVOb2RlVHlwZSxcclxuICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUsXHJcbiAgY2hpbGRyZW46IERpZmZlcmVudGlhdGVOb2RlW10sXHJcbiAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cyxcclxuICBpc1Jvb3Q/OiBib29sZWFuXHJcbn1cclxuXHJcbiIsIi8qXHJcbiAqIENvbXBhcmlzaW9uIFRvb2wgd2lsbCBsYXlvdXQgdHdvIGNvbXBhcmlzaW9uIHRyZWVzIHNpZGUgYnkgc2lkZSBhbmQgZmVlZCB0aGVtIGFuIGludGVybmFsIG9iamVjdFxyXG4gKiBoZWlyYXJjaHkgY3JlYXRlZCBmb3IgaW50ZXJuYWwgdXNlIGZyb20gSlNPTiBvYmplY3RzIGdpdmVuIHRvIHRoaXMgY29tcG9uZW50LlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1xyXG4gIERpZmZlcmVudGlhdGVOb2RlLFxyXG4gIERpZmZlcmVudGlhdGVOb2RlVHlwZSxcclxuICBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1c1xyXG59IGZyb20gJy4uL2ludGVyZmFjZXMvZGlmZmVyZW50aWF0ZS5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgVGhyb3dTdG10IH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdkaWZmZXJlbnRpYXRlJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGlmZmVyZW50aWF0ZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGlmZmVyZW50aWF0ZS5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGlmZmVyZW50aWF0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuICBcclxuICBsZWZ0U2lkZTtcclxuICByaWdodFNpZGU7XHJcbiAgcmVhZHk6IGJvb2xlYW47XHJcbiAgY2F0ZWdvcml6ZUJ5OiBzdHJpbmdbXTtcclxuXHJcbiAgQElucHV0KFwiYWxsb3dSZXZlcnRcIilcclxuICBhbGxvd1JldmVydCA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoXCJhbGxvd0FkdmFuY2VcIilcclxuICBhbGxvd0FkdmFuY2UgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KFwiYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudFwiKVxyXG4gIGF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoXCJvbmx5U2hvd0RpZmZlcmVuY2VzXCIpXHJcbiAgb25seVNob3dEaWZmZXJlbmNlcyA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoXCJsZWZ0U2lkZU9iamVjdFwiKVxyXG4gIGxlZnRTaWRlT2JqZWN0XHJcblxyXG4gIEBJbnB1dChcInJpZ2h0U2lkZU9iamVjdFwiKVxyXG4gIHJpZ2h0U2lkZU9iamVjdDtcclxuXHJcbiAgQElucHV0KFwibGVmdFNpZGVUb29sVGlwXCIpXHJcbiAgbGVmdFNpZGVUb29sVGlwID0gXCJ0YWtlIGxlZnQgc2lkZVwiO1xyXG5cclxuICBASW5wdXQoXCJyaWdodFNpZGVUb29sVGlwXCIpXHJcbiAgcmlnaHRTaWRlVG9vbFRpcCA9IFwidGFrZSByaWdodCBzaWRlXCI7XHJcblxyXG4gIEBJbnB1dCgnbmFtZWRSb290T2JqZWN0JylcclxuICBzZXQgbmFtZWRSb290T2JqZWN0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIGxldCB4ID0gdmFsdWUucmVwbGFjZShcIiBcIiwgXCJcIik7XHJcblxyXG4gICAgaWYgKHgubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcml6ZUJ5ID0gdmFsdWUuc3BsaXQoXCIsXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jYXRlZ29yaXplQnkgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBAT3V0cHV0KFwib25yZXZlcnRcIilcclxuICBvbnJldmVydCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9uYWR2YW5jZVwiKVxyXG4gIG9uYWR2YW5jZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9uZGlmZmVyZW5jZVwiKVxyXG4gIG9uZGlmZmVyZW5jZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHQpIHtcclxuXHQgIFxyXG4gIH1cclxuICBwcml2YXRlIGdlbmVyYXRlTm9kZUlkKCkge1xyXG4gICAgY29uc3QgbWluID0gMTtcclxuICAgIGNvbnN0IG1heCA9IDEwMDAwXHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICB9XHJcbiAgcHJpdmF0ZSB0cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShub2RlLCBwYXJlbnQpIHtcclxuICAgIGxldCBqc29uID0ge307XHJcbiAgICBsZXQgYXJyYXkgPSBbXTtcclxuXHJcbiAgICBub2RlLm1hcCggKGl0ZW06IERpZmZlcmVudGlhdGVOb2RlKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnN0YXR1cyAhPT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCkge1xyXG4gICAgICAgIGlmIChwYXJlbnQgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKSB7ICAgIFxyXG4gICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUucGFpcikge1xyXG4gICAgICAgICAgICBqc29uW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSkge1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShpdGVtLmNoaWxkcmVuLCBpdGVtLnBhcmVudCk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAganNvbltpdGVtLm5hbWVdID0geDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBqc29uID0gW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24pIHtcclxuICAgICAgICAgICAganNvbltpdGVtLm5hbWVdID0gdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShpdGVtLmNoaWxkcmVuLCBpdGVtLnBhcmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChwYXJlbnQgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSl7XHJcbiAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShpdGVtLCBpdGVtLnBhcmVudCkpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUoaXRlbS5jaGlsZHJlbiwgaXRlbS5wYXJlbnQpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGFycmF5Lmxlbmd0aCA/IGFycmF5IDoganNvbjtcclxuICB9XHJcbiAgcHJpdmF0ZSB0cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihub2RlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gbm9kZTtcclxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgY29uc3QgY2hpbGRyZW46IERpZmZlcmVudGlhdGVOb2RlW10gPSBbXTtcclxuICAgICAgY29uc3QgcCA9IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheTtcclxuICAgICAgbm9kZS5tYXAoIChpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgY29uc3QganNvblZhbHVlOiBhbnkgPSB0aGlzLnRyYW5zZm9ybU5vZGVUb0ludGVybmFsU3RydWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgIGlmIChqc29uVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnQpIHtcclxuICAgICAgICAgICAganNvblZhbHVlLnNvcnQoKGEsYikgPT4ge3JldHVybiBhLm5hbWUgPD0gYi5uYW1lID8gLTE6IDF9KTtcclxuICAgICAgICAgICAganNvblZhbHVlLm1hcCggKHg6IERpZmZlcmVudGlhdGVOb2RlLCBpKSA9PntcclxuICAgICAgICAgICAgICB4LmluZGV4ID0gaTtcclxuICAgICAgICAgICAgICB4LmFsdE5hbWUgPSBcIlwiICsgaTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIG5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgIGFsdE5hbWU6IFwiXCIgKyBpLFxyXG4gICAgICAgICAgICB2YWx1ZTogXCJcIixcclxuICAgICAgICAgICAgcGFyZW50OiBwLFxyXG4gICAgICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCxcclxuICAgICAgICAgICAgY2hpbGRyZW46IGpzb25WYWx1ZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgbmFtZTogXCJcIixcclxuICAgICAgICAgICAgYWx0TmFtZTogXCJcIiArIGksXHJcbiAgICAgICAgICAgIHZhbHVlOiBqc29uVmFsdWUsXHJcbiAgICAgICAgICAgIHBhcmVudDogcCxcclxuICAgICAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwsXHJcbiAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCxcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtdXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9ICAgICAgXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXN1bHQgPSBjaGlsZHJlbjtcclxuICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICBjb25zdCBsaXN0ID0gT2JqZWN0LmtleXMobm9kZSk7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuOiBEaWZmZXJlbnRpYXRlTm9kZVtdID0gW107XHJcbiAgICAgIGNvbnN0IHAgPSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbjtcclxuICAgICAgaWYgKCF0aGlzLmF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnQpIHtcclxuICAgICAgICBsaXN0LnNvcnQoKGEsYikgPT4ge3JldHVybiBhIDw9IGIgPyAtMTogMX0pO1xyXG4gICAgICB9XHJcbiAgICAgIGxpc3QubWFwKCAoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGpzb25WYWx1ZTogYW55ID0gdGhpcy50cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihub2RlW2l0ZW1dKTtcclxuICAgICAgICBpZiAoanNvblZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5hdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50KSB7XHJcbiAgICAgICAgICAgIGpzb25WYWx1ZS5zb3J0KChhLGIpID0+IHtyZXR1cm4gYS5uYW1lIDw9IGIubmFtZSA/IC0xOiAxfSk7XHJcbiAgICAgICAgICAgIGpzb25WYWx1ZS5tYXAoICh4OiBEaWZmZXJlbnRpYXRlTm9kZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgIHguaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgIHguYWx0TmFtZSA9IFwiXCIgKyBpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgbmFtZTogaXRlbSxcclxuICAgICAgICAgICAgYWx0TmFtZTogXCJcIiArIGksXHJcbiAgICAgICAgICAgIHZhbHVlOiBcIlwiLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHAsXHJcbiAgICAgICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uLFxyXG4gICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBqc29uVmFsdWVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIG5hbWU6IGl0ZW0sXHJcbiAgICAgICAgICAgIGFsdE5hbWU6IFwiXCIgKyBpLFxyXG4gICAgICAgICAgICB2YWx1ZToganNvblZhbHVlLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHAsXHJcbiAgICAgICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5wYWlyLFxyXG4gICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmVzdWx0ID0gY2hpbGRyZW47XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpdGVtSW5BcnJheShzaWRlOiBEaWZmZXJlbnRpYXRlTm9kZVtdLCBub2RlOiBEaWZmZXJlbnRpYXRlTm9kZSkge1xyXG4gICAgbGV0IHJlc3VsdDogRGlmZmVyZW50aWF0ZU5vZGU7XHJcbiAgICBjb25zdCBrZXkgPSBub2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsID9cclxuICAgICAgICAgICAgICAgIG5vZGUudmFsdWUudG9VcHBlckNhc2UoKSA6XHJcbiAgICAgICAgICAgICAgICBub2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSA/XHJcbiAgICAgICAgICAgICAgICBub2RlLmFsdE5hbWUgOlxyXG4gICAgICAgICAgICAgICAgbm9kZS5uYW1lO1xyXG5cclxuICAgIHNpZGUubWFwKCAoaXRlbTogRGlmZmVyZW50aWF0ZU5vZGUpID0+IHtcclxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwpIHtcclxuICAgICAgICBpZiAoaXRlbS52YWx1ZS50b1VwcGVyQ2FzZSgpID09PSBrZXkpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGl0ZW07XHJcbiAgICAgICAgfSAgXHJcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpIHtcclxuICAgICAgICBpZiAoaXRlbS5hbHROYW1lID09PSBrZXkpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGl0ZW07XHJcbiAgICAgICAgfSAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0ga2V5KSB7XHJcbiAgICAgICAgICByZXN1bHQgPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsZWZ0SXRlbUZyb21SaWdodEl0ZW0obGVmdE5vZGU6IERpZmZlcmVudGlhdGVOb2RlLCByaWdodE5vZGU6IERpZmZlcmVudGlhdGVOb2RlKSB7XHJcbiAgICBsZXQgcmVzdWx0OiBEaWZmZXJlbnRpYXRlTm9kZTtcclxuICAgIGlmICghbGVmdE5vZGUgfHwgIXJpZ2h0Tm9kZSkge1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgY29uc3Qga2V5ID0gcmlnaHROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsID9cclxuICAgICAgICAgICAgICAgICAgICByaWdodE5vZGUudmFsdWUudG9VcHBlckNhc2UoKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSA/XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHROb2RlLmFsdE5hbWUgOlxyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0Tm9kZS5uYW1lO1xyXG5cclxuICAgIGlmIChsZWZ0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICBpZiAobGVmdE5vZGUudmFsdWUudG9VcHBlckNhc2UoKSA9PT0ga2V5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbGVmdE5vZGU7XHJcbiAgICAgIH0gIFxyXG4gICAgfSBlbHNlIGlmIChsZWZ0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpIHtcclxuICAgICAgaWYgKGxlZnROb2RlLmFsdE5hbWUgPT09IGtleSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGxlZnROb2RlO1xyXG4gICAgICB9ICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS5uYW1lID09PSBrZXkpIHtcclxuICAgICAgICByZXN1bHQgPSBsZWZ0Tm9kZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29tcGFyZShsZWZ0Tm9kZTogRGlmZmVyZW50aWF0ZU5vZGUsIHJpZ2h0Tm9kZTogRGlmZmVyZW50aWF0ZU5vZGUpIHtcclxuICAgIGlmIChsZWZ0Tm9kZS50eXBlICE9PSByaWdodE5vZGUudHlwZSkge1xyXG4gICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy50eXBlQ2hhbmdlZDtcclxuICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnR5cGVDaGFuZ2VkO1xyXG4gICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICB9IGVsc2UgaWYgKGxlZnROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS52YWx1ZSAhPT0gcmlnaHROb2RlLnZhbHVlKSB7XHJcbiAgICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQ7XHJcbiAgICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAobGVmdE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLnBhaXIpIHtcclxuICAgICAgaWYgKGxlZnROb2RlLm5hbWUgIT09IHJpZ2h0Tm9kZS5uYW1lKSB7XHJcbiAgICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkO1xyXG4gICAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS52YWx1ZSAhPT0gcmlnaHROb2RlLnZhbHVlKSB7XHJcbiAgICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQ7XHJcbiAgICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS5uYW1lICE9PSByaWdodE5vZGUubmFtZSkge1xyXG4gICAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZDtcclxuICAgICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVuaWZ5KGxlZnROb2RlLmNoaWxkcmVuLCByaWdodE5vZGUuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIHJlSW5kZXgobGlzdDogRGlmZmVyZW50aWF0ZU5vZGVbXSkge1xyXG4gICAgbGlzdC5tYXAoKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaXRlbS5pbmRleCA9IGk7XHJcbiAgICAgIHRoaXMucmVJbmRleChpdGVtLmNoaWxkcmVuKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGNvcHlJbnRvKFxyXG4gICAgICAgICAgICAgIHNpZGU6IERpZmZlcmVudGlhdGVOb2RlW10sXHJcbiAgICAgICAgICAgICAgaXRlbTogRGlmZmVyZW50aWF0ZU5vZGUsXHJcbiAgICAgICAgICAgICAgaW5kZXg6IG51bWJlcixcclxuICAgICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzKSB7XHJcbiAgICBjb25zdCBuZXdJdGVtID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShpdGVtKSk7XHJcbiAgICBzaWRlLnNwbGljZShpbmRleCwgMCwgbmV3SXRlbSk7XHJcbiAgICB0aGlzLnJlSW5kZXgoc2lkZSk7XHJcblxyXG4gICAgaXRlbS5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICBuZXdJdGVtLnN0YXR1cyA9IHN0YXR1cztcclxuICAgIGl0ZW0uY291bnRlcnBhcnQgPSBuZXdJdGVtLmlkO1xyXG4gICAgbmV3SXRlbS5jb3VudGVycGFydCA9IGl0ZW0uaWQ7XHJcbiAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGl0ZW0uY2hpbGRyZW4sIHN0YXR1cylcclxuICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobmV3SXRlbS5jaGlsZHJlbiwgc3RhdHVzKVxyXG4gIH1cclxuICBwcml2YXRlIHNldENoaWxkcmVuU3RhdHVzKGxpc3QsIHN0YXR1cyl7XHJcbiAgICBsaXN0Lm1hcCggKHgpID0+IHtcclxuICAgICAgeC5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMoeC5jaGlsZHJlbiwgc3RhdHVzKVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgdW5pZnkobGVmdFNpZGU6IERpZmZlcmVudGlhdGVOb2RlW10sIHJpZ2h0U2lkZTogRGlmZmVyZW50aWF0ZU5vZGVbXSkge1xyXG4gICAgbGV0IGkgPSAwLCBqID0gMCwgbG9vcGluZyA9IHRydWU7XHJcblxyXG4gICAgd2hpbGUgKGxvb3BpbmcpIHtcclxuICAgICAgbGV0IGxlZnRJdGVtSW5SaWdodFNpZGU6IERpZmZlcmVudGlhdGVOb2RlID0gaSA8IGxlZnRTaWRlLmxlbmd0aCA/IHRoaXMuaXRlbUluQXJyYXkocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSkgOiB1bmRlZmluZWQ7XHJcbiAgICAgIGxldCByaWdodEl0ZW1JbkxlZnRTaWRlOiBEaWZmZXJlbnRpYXRlTm9kZSA9IGogPCByaWdodFNpZGUubGVuZ3RoID8gdGhpcy5pdGVtSW5BcnJheShsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdKSA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgIGlmICghbGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiBpIDwgbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKCFyaWdodFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICB3aGlsZSAoaSA8IGxlZnRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFyaWdodEl0ZW1JbkxlZnRTaWRlICYmIGogPCByaWdodFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKCFsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgIHdoaWxlIChqIDwgcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlJbnRvKGxlZnRTaWRlLCByaWdodFNpZGVbal0sIGosIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKTtcclxuICAgICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoIWxlZnRJdGVtSW5SaWdodFNpZGUpIHtcclxuICAgICAgICBsZWZ0SXRlbUluUmlnaHRTaWRlID0gaiA8IHJpZ2h0U2lkZS5sZW5ndGggPyByaWdodFNpZGVbal0gOiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFyaWdodEl0ZW1JbkxlZnRTaWRlKSB7XHJcbiAgICAgICAgcmlnaHRJdGVtSW5MZWZ0U2lkZSA9IGkgPCBsZWZ0U2lkZS5sZW5ndGggPyBsZWZ0U2lkZVtpXSA6IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiBsZWZ0SXRlbUluUmlnaHRTaWRlLmluZGV4ICE9PSBpKSB7XHJcbiAgICAgICAgd2hpbGUgKGkgPCBsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgIGxlZnRJdGVtSW5SaWdodFNpZGUgPSB0aGlzLmxlZnRJdGVtRnJvbVJpZ2h0SXRlbShyaWdodFNpZGVbaV0sIGxlZnRTaWRlW2ldKTtcclxuICAgICAgICAgIGlmIChsZWZ0SXRlbUluUmlnaHRTaWRlKSB7XHJcbiAgICAgICAgICAgIGxlZnRJdGVtSW5SaWdodFNpZGUgPSBqIDwgcmlnaHRTaWRlLmxlbmd0aCA/IHJpZ2h0U2lkZVtqXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gIFxyXG4gICAgICB9XHJcbiAgICAgIGlmIChyaWdodEl0ZW1JbkxlZnRTaWRlICYmIHJpZ2h0SXRlbUluTGVmdFNpZGUuaW5kZXggIT09IGopIHtcclxuICAgICAgICB3aGlsZSAoaiA8IHJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgIHJpZ2h0SXRlbUluTGVmdFNpZGUgPSB0aGlzLmxlZnRJdGVtRnJvbVJpZ2h0SXRlbShsZWZ0U2lkZVtqXSwgcmlnaHRTaWRlW2pdKTtcclxuICAgICAgICAgIGlmIChyaWdodEl0ZW1JbkxlZnRTaWRlKSB7XHJcbiAgICAgICAgICAgIHJpZ2h0SXRlbUluTGVmdFNpZGUgPSBpIDwgbGVmdFNpZGUubGVuZ3RoID8gbGVmdFNpZGVbaV0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChsZWZ0SXRlbUluUmlnaHRTaWRlICYmIGkgPCBsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICBsZXQgeCA9IHRoaXMuaXRlbUluQXJyYXkocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSk7XHJcbiAgICAgICAgaWYgKHggJiYgeC5pbmRleCAhPT0gbGVmdEl0ZW1JblJpZ2h0U2lkZS5pbmRleCkge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgbGVmdEl0ZW1JblJpZ2h0U2lkZSA9IGogPCByaWdodFNpZGUubGVuZ3RoID8gcmlnaHRTaWRlW2pdIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAocmlnaHRJdGVtSW5MZWZ0U2lkZSAmJiBqIDwgcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgIGxldCB4ID0gdGhpcy5pdGVtSW5BcnJheShsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdKTtcclxuICAgICAgICBpZiAoeCAmJiB4LmluZGV4ICE9PSByaWdodEl0ZW1JbkxlZnRTaWRlLmluZGV4KSB7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIHJpZ2h0SXRlbUluTGVmdFNpZGUgPSBpIDwgbGVmdFNpZGUubGVuZ3RoID8gbGVmdFNpZGVbaV0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChsZWZ0SXRlbUluUmlnaHRTaWRlICYmIHJpZ2h0SXRlbUluTGVmdFNpZGUpIHtcclxuICAgICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZS5wYXJlbnQgIT09IHJpZ2h0SXRlbUluTGVmdFNpZGUucGFyZW50KSB7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKGxlZnRTaWRlLCByaWdodFNpZGVbal0sIGosIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKTtcclxuICAgICAgICAgIHRoaXMuY29weUludG8ocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSwgaSwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29tcGFyZShsZWZ0SXRlbUluUmlnaHRTaWRlLCByaWdodEl0ZW1JbkxlZnRTaWRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaisrO2krKztcclxuICAgICAgfVxyXG4gICAgICBsb29waW5nID0gKGkgPCBsZWZ0U2lkZS5sZW5ndGggfHwgaiA8IHJpZ2h0U2lkZS5sZW5ndGgpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIHRvSW50ZXJuYWxTdHJ1Y3Rpb24obGVmdE5vZGUsIHJpZ2h0Tm9kZSkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0ge1xyXG4gICAgICBsZWZ0U2lkZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihsZWZ0Tm9kZSksXHJcbiAgICAgIHJpZ2h0U2lkZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihyaWdodE5vZGUpXHJcbiAgICB9O1xyXG4gICAgdGhpcy51bmlmeShyZXN1bHQubGVmdFNpZGUsIHJlc3VsdC5yaWdodFNpZGUpO1xyXG5cclxuICAgIGlmICh0aGlzLm9ubHlTaG93RGlmZmVyZW5jZXMpIHtcclxuICAgICAgcmVzdWx0LmxlZnRTaWRlID0gdGhpcy5maWx0ZXJVbmNoYW5nZWQocmVzdWx0LmxlZnRTaWRlKTtcclxuICAgICAgcmVzdWx0LnJpZ2h0U2lkZSA9IHRoaXMuZmlsdGVyVW5jaGFuZ2VkKHJlc3VsdC5yaWdodFNpZGUpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgcHJpdmF0ZSBmaWx0ZXJVbmNoYW5nZWQobGlzdDogRGlmZmVyZW50aWF0ZU5vZGVbXSkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICBcclxuICAgIGxpc3QubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICBpdGVtLmNoaWxkcmVuID0gdGhpcy5maWx0ZXJVbmNoYW5nZWQoaXRlbS5jaGlsZHJlbik7XHJcbiAgICAgIGlmICgoaXRlbS50eXBlID4gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLnBhaXIgJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGgpIHx8XHJcbiAgICAgICAgICBpdGVtLnN0YXR1cyAhPT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJlc3VsdC5tYXAoICh4OiBEaWZmZXJlbnRpYXRlTm9kZSwgaSkgPT4ge1xyXG4gICAgICB4LmluZGV4ID0gaTtcclxuICAgICAgeC5hbHROYW1lID0gXCJcIiArIGk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5hdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50IHx8XHJcbiAgICAgIGNoYW5nZXMub25seVNob3dEaWZmZXJlbmNlcyB8fFxyXG4gICAgICBjaGFuZ2VzLmxlZnRTaWRlT2JqZWN0IHx8XHJcbiAgICAgIGNoYW5nZXMubmFtZWRSb290T2JqZWN0IHx8XHJcbiAgICAgIGNoYW5nZXMucmlnaHRTaWRlT2JqZWN0KSB7XHJcbiAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcclxuICAgICAgdGhpcy5uZ09uSW5pdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpPT50aGlzLmluaXQoKSw2NjYpO1xyXG4gIH1cclxuICBwcml2YXRlIGNhdGVnb3JpemVkTmFtZShpdGVtKSB7XHJcbiAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICB0aGlzLmNhdGVnb3JpemVCeS5tYXAoKGNhdGVnb3J5KSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLm5hbWUgPT09IGNhdGVnb3J5KSB7XHJcbiAgICAgICAgbmFtZSA9IGl0ZW0udmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG5hbWU7XHJcbiAgfVxyXG4gIHByaXZhdGUgc2lkZUNhdGVnb3JpemVkTmFtZShzaWRlKSB7XHJcbiAgICBzaWRlLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgbmFtZXMgPSBbXTtcclxuICAgICAgaXRlbS5jaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMuY2F0ZWdvcml6ZWROYW1lKGNoaWxkKTtcclxuICAgICAgICBpZihTdHJpbmcobmFtZSkubGVuZ3RoKSB7XHJcbiAgICAgICAgICBuYW1lcy5wdXNoKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGl0ZW0uY2F0ZWdvcml6ZUJ5ID0gbmFtZXMubGVuZ3RoID4gMSA/IG5hbWVzLmpvaW4oXCIgLSBcIikgOiBuYW1lc1swXTtcclxuICAgICAgaXRlbS5jb2xsYXBzZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgaW5pdCgpIHtcclxuICAgIGlmICh0aGlzLmxlZnRTaWRlT2JqZWN0ICYmIHRoaXMucmlnaHRTaWRlT2JqZWN0KSB7XHJcbiAgICAgIGNvbnN0IGxlZnQgPSAodGhpcy5sZWZ0U2lkZU9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSAgPyB0aGlzLmxlZnRTaWRlT2JqZWN0IDogW3RoaXMubGVmdFNpZGVPYmplY3RdXHJcbiAgICAgIGNvbnN0IHJpZ2h0ID0gKHRoaXMucmlnaHRTaWRlT2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpICA/IHRoaXMucmlnaHRTaWRlT2JqZWN0IDogW3RoaXMucmlnaHRTaWRlT2JqZWN0XVxyXG4gICAgICBjb25zdCBjb21wYXJpc2lvbiA9IHRoaXMudG9JbnRlcm5hbFN0cnVjdGlvbihsZWZ0LCByaWdodCk7XHJcbiAgICAgIGlmICh0aGlzLmNhdGVnb3JpemVCeSkge1xyXG4gICAgICAgIHRoaXMuc2lkZUNhdGVnb3JpemVkTmFtZShjb21wYXJpc2lvbi5sZWZ0U2lkZSk7XHJcbiAgICAgICAgdGhpcy5zaWRlQ2F0ZWdvcml6ZWROYW1lKGNvbXBhcmlzaW9uLnJpZ2h0U2lkZSk7XHJcbiAgICAgIH0gIFxyXG4gICAgICB0aGlzLmxlZnRTaWRlID0gW3tcclxuICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgIG5hbWU6IFwiXCIsXHJcbiAgICAgICAgdmFsdWU6IFwiUm9vdFwiLFxyXG4gICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgIHBhcmVudDogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5LFxyXG4gICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICBleHBhbmRlZDogdHJ1ZSxcclxuICAgICAgICBpc1Jvb3Q6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IGNvbXBhcmlzaW9uLmxlZnRTaWRlXHJcbiAgICAgIH1dO1xyXG4gICAgICB0aGlzLnJpZ2h0U2lkZT0gW3tcclxuICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgIG5hbWU6IFwiXCIsXHJcbiAgICAgICAgdmFsdWU6IFwiUm9vdFwiLFxyXG4gICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgIHBhcmVudDogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5LFxyXG4gICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICBleHBhbmRlZDogdHJ1ZSxcclxuICAgICAgICBpc1Jvb3Q6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IGNvbXBhcmlzaW9uLnJpZ2h0U2lkZVxyXG4gICAgICB9XTtcclxuICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZmlyZUNvdW50RGlmZmVyZW5jZSgpO1xyXG4gICAgICB9LDMzMyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgZmlyZUNvdW50RGlmZmVyZW5jZSgpIHtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICB0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuLm1hcCggKGxpc3RJdGVtKSA9PiB7XHJcbiAgICAgIGxpc3RJdGVtLmNoaWxkcmVuLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICBpZihpdGVtLnN0YXR1cyAhPT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCkge1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIHRoaXMub25kaWZmZXJlbmNlLmVtaXQoY291bnQpO1xyXG4gIH1cclxuICBwcml2YXRlIGxvb2t1cENoaWxkT2Yoc2lkZSwgcGFyZW50T2JqZWN0LCBpZCkge1xyXG4gICAgbGV0IGZvdW5kSXRlbSA9IHVuZGVmaW5lZDtcclxuICAgIGlmIChzaWRlLmlkID09PSBpZCkge1xyXG4gICAgICBmb3VuZEl0ZW0gPSB7cGFyZW50OiBwYXJlbnRPYmplY3QsIG5vZGU6IHNpZGV9O1xyXG4gICAgfSBlbHNlIGlmIChzaWRlLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICBzaWRlLmNoaWxkcmVuLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICBpZiAoIWZvdW5kSXRlbSkge1xyXG4gICAgICAgICAgZm91bmRJdGVtID0gdGhpcy5sb29rdXBDaGlsZE9mKGl0ZW0sIHVuZGVmaW5lZCwgaWQpO1xyXG4gICAgICAgICAgaWYgKGZvdW5kSXRlbSAmJiBmb3VuZEl0ZW0ucGFyZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm91bmRJdGVtLnBhcmVudCA9IHNpZGU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgIGZvdW5kSXRlbSA9IHtwYXJlbnQ6IHNpZGUsIG5vZGU6IGl0ZW19O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IFxyXG4gICAgcmV0dXJuIGZvdW5kSXRlbTtcclxuICB9XHJcbiAgcHJpdmF0ZSBwZXJmb3JtQWR2YW5jZVRvUmlnaHQobGVmdFNpZGVJbmZvLCByaWdodFNpZGVJbmZvLCBzdGF0dXMsIGkpIHtcclxuICAgIGNvbnN0IG1vZGlmaWVkQ2hpbGRyZW4gPSB0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuO1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuLnNwbGljZShsZWZ0U2lkZUluZm8ubm9kZS5pbmRleCwgMSk7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuLnNwbGljZShyaWdodFNpZGVJbmZvLm5vZGUuaW5kZXgsIDEpO1xyXG4gICAgICB0aGlzLnJlSW5kZXgobGVmdFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbik7XHJcbiAgICAgIHRoaXMucmVJbmRleChyaWdodFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbik7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUubmFtZSA9IHJpZ2h0U2lkZUluZm8ubm9kZS5uYW1lO1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQpIHtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnZhbHVlID0gbGVmdFNpZGVJbmZvLm5vZGUudmFsdWU7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnR5cGVDaGFuZ2VkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnR5cGUgPSByaWdodFNpZGVJbmZvLm5vZGUudHlwZTtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4gPSByaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW47XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+e1xyXG4gICAgICB0aGlzLm9uYWR2YW5jZS5lbWl0KHtcclxuICAgICAgICBpbmRleDogaSxcclxuICAgICAgICBub2RlOiB0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKG1vZGlmaWVkQ2hpbGRyZW4sIERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5maXJlQ291bnREaWZmZXJlbmNlKCk7XHJcbiAgICB9LCA2Nik7XHJcbiAgfVxyXG4gIHByaXZhdGUgcGVyZm9ybUFkdmFuY2VUb0xlZnQobGVmdFNpZGVJbmZvLCByaWdodFNpZGVJbmZvLCBzdGF0dXMsIGkpIHtcclxuICAgIGNvbnN0IG1vZGlmaWVkQ2hpbGRyZW4gPSB0aGlzLnJpZ2h0U2lkZVswXS5jaGlsZHJlbltpXS5jaGlsZHJlbjtcclxuICAgIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UobGVmdFNpZGVJbmZvLm5vZGUuaW5kZXgsIDEpO1xyXG4gICAgICByaWdodFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UocmlnaHRTaWRlSW5mby5ub2RlLmluZGV4LCAxKTtcclxuICAgICAgdGhpcy5yZUluZGV4KGxlZnRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgICB0aGlzLnJlSW5kZXgocmlnaHRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkKSB7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5uYW1lID0gbGVmdFNpZGVJbmZvLm5vZGUubmFtZTtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnZhbHVlID0gcmlnaHRTaWRlSW5mby5ub2RlLnZhbHVlO1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy50eXBlQ2hhbmdlZCkge1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUudHlwZSA9IGxlZnRTaWRlSW5mby5ub2RlLnR5cGU7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiA9IGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKSA9PntcclxuICAgICAgdGhpcy5vbnJldmVydC5lbWl0KHtcclxuICAgICAgICBpbmRleDogaSxcclxuICAgICAgICBub2RlOiB0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKG1vZGlmaWVkQ2hpbGRyZW4sIERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5maXJlQ291bnREaWZmZXJlbmNlKCk7XHJcbiAgICB9LCA2Nik7XHJcbiAgfVxyXG4gIGFkdmFuY2UoZXZlbnQpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoZXZlbnQubm9kZS5wYXRoLnNwbGl0KFwiLFwiKVsxXSk7XHJcblxyXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdhZHZhbmNlJykge1xyXG4gICAgICB0aGlzLnBlcmZvcm1BZHZhbmNlVG9MZWZ0KFxyXG4gICAgICAgIHRoaXMubG9va3VwQ2hpbGRPZih0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XSwgdGhpcy5sZWZ0U2lkZVswXSwgZXZlbnQubm9kZS5pZCksIFxyXG4gICAgICAgIHRoaXMubG9va3VwQ2hpbGRPZih0aGlzLnJpZ2h0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMucmlnaHRTaWRlWzBdLCBldmVudC5ub2RlLmNvdW50ZXJwYXJ0KSwgXHJcbiAgICAgICAgZXZlbnQubm9kZS5zdGF0dXMsIGluZGV4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucGVyZm9ybUFkdmFuY2VUb1JpZ2h0KFxyXG4gICAgICAgIHRoaXMubG9va3VwQ2hpbGRPZih0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XSwgdGhpcy5sZWZ0U2lkZVswXSwgZXZlbnQubm9kZS5jb3VudGVycGFydCksIFxyXG4gICAgICAgIHRoaXMubG9va3VwQ2hpbGRPZih0aGlzLnJpZ2h0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMucmlnaHRTaWRlWzBdLCBldmVudC5ub2RlLmlkKSwgXHJcbiAgICAgICAgZXZlbnQubm9kZS5zdGF0dXMsIGluZGV4KTtcclxuICAgIH1cclxuICB9XHJcbiAgYXV0b0V4cGFuZChldmVudCkge1xyXG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChldmVudC5zcGxpdChcIixcIilbMV0pO1xyXG4gICAgY29uc3QgbGMgPSB0aGlzLnJpZ2h0U2lkZVswXS5jaGlsZHJlbltpbmRleF07XHJcbiAgICBjb25zdCByYyA9IHRoaXMubGVmdFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdO1xyXG4gICAgXHJcbiAgICBsYy5jb2xsYXBzZWQgPSAhbGMuY29sbGFwc2VkO1xyXG4gICAgcmMuY29sbGFwc2VkID0gIXJjLmNvbGxhcHNlZDtcclxuICB9XHJcbiAgb25ob3ZlcihldmVudCkge1xyXG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChldmVudC5wYXRoLnNwbGl0KFwiLFwiKVsxXSk7XHJcblxyXG4gICAgdGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLmNoaWxkcmVuW2V2ZW50LmluZGV4XS5ob3ZlciA9IGV2ZW50LmhvdmVyO1xyXG4gICAgdGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpbmRleF0uY2hpbGRyZW5bZXZlbnQuaW5kZXhdLmhvdmVyID0gZXZlbnQuaG92ZXI7XHJcbiAgfVxyXG59XHJcbiIsIi8qXHJcbiAqIEEgY29tcGFyaXNpb24gdHJlZSB3aWxsIGxheW91dCBlYWNoIGF0dHJpYnV0ZSBvZiBhIGpzb24gZGVlcCB0aHJvdWdoIGl0cyBoZWlyYXJjaHkgd2l0aCBnaXZlbiB2aXN1YWwgcXVldWVzXHJcbiAqIHRoYXQgcmVwcmVzZW50cyBhIGRlbGV0aW9uLCBhZGl0aW9uLCBvciBjaGFuZ2Ugb2YgYXR0cmlidXRlIGZyb20gdGhlIG90aGVyIHRyZWUuIFRoZSBzdGF0dXMgb2YgZWFjaCBub2RlIGlzIFxyXG4gKiBldmFsdWF0ZWQgYnkgdGhlIHBhcmVudCBjb21wYXJpc2lvbiB0b29sLlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7RGlmZmVyZW50aWF0ZU5vZGVTdGF0dXN9IGZyb20gJy4uL2ludGVyZmFjZXMvZGlmZmVyZW50aWF0ZS5pbnRlcmZhY2VzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZGlmZmVyZW50aWF0ZS10cmVlJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGlmZmVyZW50aWF0ZS10cmVlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kaWZmZXJlbnRpYXRlLXRyZWUuY29tcG9uZW50LnNjc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIERpZmZlcmVudGlhdGVUcmVlIGltcGxlbWVudHMgT25Jbml0e1xyXG4gIGRlcHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcImNvbGxhcHNlZFwiKVxyXG4gIGNvbGxhcHNlZCA9IHRydWU7XHJcblxyXG4gIEBJbnB1dChcImNoaWxkcmVuXCIpXHJcbiAgY2hpbGRyZW47XHJcblxyXG4gIEBJbnB1dChcInNob3dMZWZ0QWN0aW9uQnV0dG9uXCIpXHJcbiAgc2hvd0xlZnRBY3Rpb25CdXR0b24gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KFwic2hvd1JpZ2h0QWN0aW9uQnV0dG9uXCIpXHJcbiAgc2hvd1JpZ2h0QWN0aW9uQnV0dG9uID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcInN0YXR1c1wiKVxyXG4gIHN0YXR1cyA9IDE7XHJcblxyXG4gIEBJbnB1dChcInNpZGVcIilcclxuICBzaWRlID0gXCJcIjtcclxuXHJcbiAgQElucHV0KFwibGV2ZWxcIilcclxuICBsZXZlbCA9IFwiMFwiO1xyXG5cclxuICBASW5wdXQoXCJvYmplY3RQYXRoXCIpXHJcbiAgb2JqZWN0UGF0aCA9IFwiXCI7XHJcblxyXG4gIEBJbnB1dChcImNhdGVnb3JpemVCeVwiKVxyXG4gIGNhdGVnb3JpemVCeTogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJsZWZ0U2lkZVRvb2xUaXBcIilcclxuICBsZWZ0U2lkZVRvb2xUaXAgPSBcInRha2UgbGVmdCBzaWRlXCI7XHJcblxyXG4gIEBJbnB1dChcInJpZ2h0U2lkZVRvb2xUaXBcIilcclxuICByaWdodFNpZGVUb29sVGlwID0gXCJ0YWtlIHJpZ2h0IHNpZGVcIjtcclxuXHJcbiAgQE91dHB1dChcIm9uaG92ZXJcIilcclxuICBvbmhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25yZXZlcnRcIilcclxuICBvbnJldmVydCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9uZXhwYW5kXCIpXHJcbiAgb25leHBhbmQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5kZXB0aCA9IHBhcnNlSW50KHRoaXMubGV2ZWwpO1xyXG4gIH1cclxuXHJcbiAgYnVibGV1cChldmVudCkge1xyXG4gICAgZXZlbnQuc2lkZSA9IHRoaXMuc2lkZTtcclxuICAgIHRoaXMub25ob3Zlci5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIGtleXVwKGV2ZW50KSB7XHJcbiAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICBpZiAoY29kZSA9PT0gMTMpIHtcclxuICAgICAgZXZlbnQudGFyZ2V0LmNsaWNrKCk7XHJcblx0XHR9XHJcbiAgfVxyXG5cclxuICBjaGFuZ0NvdW50ZXIoKSB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgdGhpcy5jaGlsZHJlbi5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgIGlmKGl0ZW0uc3RhdHVzICE9PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0KSB7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBjb3VudDtcclxuICB9XHJcblxyXG4gIGV4cGFuZChldmVudCkge1xyXG4gICAgdGhpcy5vbmV4cGFuZC5lbWl0KCB0aGlzLm9iamVjdFBhdGggKTtcclxuICB9XHJcbiAgYXV0b0V4cGFuZChldmVudCkge1xyXG4gICAgdGhpcy5vbmV4cGFuZC5lbWl0KGV2ZW50KTtcclxuICB9XHJcbiAgYWR2YW5jZVRvUmlnaHRTaWRlKGNoaWxkKSB7XHJcbiAgICBjaGlsZC5wYXRoID0gdGhpcy5vYmplY3RQYXRoICsgKHRoaXMub2JqZWN0UGF0aC5sZW5ndGggPyAnLCc6JycpICsgY2hpbGQuaW5kZXg7XHJcbiAgICB0aGlzLm9ucmV2ZXJ0LmVtaXQoe3R5cGU6XCJhZHZhbmNlXCIsIG5vZGU6IGNoaWxkfSk7XHJcbiAgfVxyXG4gIGFkdmFuY2VUb0xlZnRTaWRlKGNoaWxkKSB7XHJcbiAgICBjaGlsZC5wYXRoID0gdGhpcy5vYmplY3RQYXRoICsgKHRoaXMub2JqZWN0UGF0aC5sZW5ndGggPyAnLCc6JycpICsgY2hpbGQuaW5kZXg7XHJcbiAgICB0aGlzLm9ucmV2ZXJ0LmVtaXQoe3R5cGU6XCJyZXZlcnRcIiwgbm9kZTogY2hpbGR9KTtcclxuICB9XHJcbiAgYWR2YW5jZShldmVudCkge1xyXG4gICAgLy8gYnViYmxlIHVwIHRoZSB1bmRvIGV2ZW50LlxyXG4gICAgdGhpcy5vbnJldmVydC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIG1vdXNlT3ZlcmVkKGV2ZW50LCBmbGFnLCBpKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlmICh0aGlzLmRlcHRoID09PSAyKSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5vbmhvdmVyLmVtaXQoe1xyXG4gICAgICAgIGhvdmVyOiBmbGFnLFxyXG4gICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgIHBhdGg6IHRoaXMub2JqZWN0UGF0aFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmltcG9ydCB7IERpZmZlcmVudGlhdGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZGlmZmVyZW50aWF0ZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEaWZmZXJlbnRpYXRlVHJlZSB9IGZyb20gJy4vY29tcG9uZW50cy9kaWZmZXJlbnRpYXRlLXRyZWUuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIERpZmZlcmVudGlhdGVDb21wb25lbnQsXHJcbiAgICBEaWZmZXJlbnRpYXRlVHJlZVxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRGlmZmVyZW50aWF0ZUNvbXBvbmVudFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICBdLFxyXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIERpZmZlcmVudGlhdGVNb2R1bGUge31cclxuIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsIkNvbXBvbmVudCIsIklucHV0IiwiT3V0cHV0IiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJDVVNUT01fRUxFTUVOVFNfU0NIRU1BIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7UUFFRSxVQUFXO1FBQ1gsT0FBUTtRQUNSLE9BQVE7UUFDUixRQUFTOztnREFIVCxPQUFPO2dEQUNQLElBQUk7Z0RBQ0osSUFBSTtnREFDSixLQUFLOzs7UUFHTCxVQUFXO1FBQ1gsY0FBZTtRQUNmLGNBQWU7UUFDZixlQUFnQjtRQUNoQixRQUFTO1FBQ1QsVUFBVzs7b0RBTFgsT0FBTztvREFDUCxXQUFXO29EQUNYLFdBQVc7b0RBQ1gsWUFBWTtvREFDWixLQUFLO29EQUNMLE9BQU87Ozs7OztBQ1RUO1FBd0VFOytCQTNDYyxLQUFLO2dDQUdKLEtBQUs7NkNBR1EsSUFBSTt1Q0FHVixLQUFLO21DQVNULGdCQUFnQjtvQ0FHZixpQkFBaUI7NEJBY3pCLElBQUlBLGlCQUFZLEVBQUU7NkJBR2pCLElBQUlB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