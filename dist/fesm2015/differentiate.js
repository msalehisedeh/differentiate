import { Component, Input, Output, EventEmitter, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const DifferentiateNodeType = {
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
const DifferentiateNodeStatus = {
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
class DifferentiateComponent {
    constructor() {
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
    /**
     * @param {?} value
     * @return {?}
     */
    set namedRootObject(value) {
        /** @type {?} */
        let x = value.replace(" ", "");
        if (x.length) {
            this.categorizeBy = value.split(",");
        }
        else {
            this.categorizeBy = undefined;
        }
    }
    /**
     * @return {?}
     */
    generateNodeId() {
        /** @type {?} */
        const min = 1;
        /** @type {?} */
        const max = 10000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * @param {?} node
     * @param {?} parent
     * @return {?}
     */
    transformNodeToOriginalStructure(node, parent) {
        /** @type {?} */
        let json = {};
        /** @type {?} */
        let array = [];
        node.map((item) => {
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
                        const x = this.transformNodeToOriginalStructure(item.children, item.parent);
                        if (item.name.length) {
                            json[item.name] = x;
                        }
                        else {
                            json = [x];
                        }
                    }
                    else if (item.type === DifferentiateNodeType.json) {
                        json[item.name] = this.transformNodeToOriginalStructure(item.children, item.parent);
                    }
                }
                else if (parent === DifferentiateNodeType.array) {
                    if (item.type === DifferentiateNodeType.literal) {
                        array.push(item.value);
                    }
                    else if (item.type === DifferentiateNodeType.json) {
                        array.push(this.transformNodeToOriginalStructure(item, item.parent));
                    }
                    else if (item.type === DifferentiateNodeType.array) {
                        array.push(this.transformNodeToOriginalStructure(item.children, item.parent));
                    }
                }
            }
        });
        return array.length ? array : json;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    transformNodeToInternalStruction(node) {
        /** @type {?} */
        let result = node;
        if (node instanceof Array) {
            /** @type {?} */
            const children = [];
            /** @type {?} */
            const p = DifferentiateNodeType.array;
            node.map((item, i) => {
                /** @type {?} */
                const jsonValue = this.transformNodeToInternalStruction(item);
                if (jsonValue instanceof Array) {
                    if (!this.attributeOrderIsImportant) {
                        jsonValue.sort((a, b) => { return a.name <= b.name ? -1 : 1; });
                        jsonValue.map((x, i) => {
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
                }
                else {
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
        }
        else if (node instanceof Object) {
            /** @type {?} */
            const list = Object.keys(node);
            /** @type {?} */
            const children = [];
            /** @type {?} */
            const p = DifferentiateNodeType.json;
            if (!this.attributeOrderIsImportant) {
                list.sort((a, b) => { return a <= b ? -1 : 1; });
            }
            list.map((item, i) => {
                /** @type {?} */
                const jsonValue = this.transformNodeToInternalStruction(node[item]);
                if (jsonValue instanceof Array) {
                    if (!this.attributeOrderIsImportant) {
                        jsonValue.sort((a, b) => { return a.name <= b.name ? -1 : 1; });
                        jsonValue.map((x, i) => {
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
                }
                else {
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
    /**
     * @param {?} side
     * @param {?} node
     * @return {?}
     */
    itemInArray(side, node) {
        /** @type {?} */
        let result;
        /** @type {?} */
        const key = node.type === DifferentiateNodeType.literal ?
            (node.value ? String(node.value).toUpperCase() : "") :
            node.type === DifferentiateNodeType.array ?
                node.altName :
                node.name;
        side.map((item) => {
            if (item.type === DifferentiateNodeType.literal) {
                if (item.value && String(item.value).toUpperCase() === key) {
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
    }
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    leftItemFromRightItem(leftNode, rightNode) {
        /** @type {?} */
        let result;
        if (!leftNode || !rightNode) {
            return result;
        }
        /** @type {?} */
        const key = rightNode.type === DifferentiateNodeType.literal ?
            (rightNode.value ? rightNode.value.toUpperCase() : "") :
            rightNode.type === DifferentiateNodeType.array ?
                rightNode.altName :
                rightNode.name;
        if (leftNode.type === DifferentiateNodeType.literal) {
            if (leftNode.value && String(leftNode.value).toUpperCase() === key) {
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
        if (item) {
            /** @type {?} */
            const newItem = JSON.parse(JSON.stringify(item));
            side.splice(index, 0, newItem);
            this.reIndex(side);
            item.status = status;
            newItem.status = status;
            item.counterpart = newItem.id;
            newItem.counterpart = item.id;
            this.setChildrenStatus(item.children, status);
            this.setChildrenStatus(newItem.children, status);
        }
    }
    /**
     * @param {?} list
     * @param {?} status
     * @return {?}
     */
    setChildrenStatus(list, status) {
        list.map((x) => {
            x.status = status;
            this.setChildrenStatus(x.children, status);
        });
    }
    /**
     * @param {?} leftSide
     * @param {?} rightSide
     * @return {?}
     */
    unify(leftSide, rightSide) {
        /** @type {?} */
        let i = 0;
        /** @type {?} */
        let j = 0;
        /** @type {?} */
        let looping = true;
        while (looping) {
            /** @type {?} */
            let leftItemInRightSide = i < leftSide.length ? this.itemInArray(rightSide, leftSide[i]) : undefined;
            /** @type {?} */
            let rightItemInLeftSide = j < rightSide.length ? this.itemInArray(leftSide, rightSide[j]) : undefined;
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
                let x = this.itemInArray(rightSide, leftSide[i]);
                if (x && x.index !== leftItemInRightSide.index) {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    j++;
                    i++;
                    leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                }
            }
            if (rightItemInLeftSide && j < rightSide.length) {
                /** @type {?} */
                let x = this.itemInArray(leftSide, rightSide[j]);
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
    }
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    toInternalStruction(leftNode, rightNode) {
        /** @type {?} */
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
    /**
     * @param {?} list
     * @return {?}
     */
    filterUnchanged(list) {
        /** @type {?} */
        const result = [];
        list.map((item) => {
            item.children = this.filterUnchanged(item.children);
            if ((item.type > DifferentiateNodeType.pair && item.children.length) ||
                item.status !== DifferentiateNodeStatus.default) {
                result.push(item);
            }
        });
        result.map((x, i) => {
            x.index = i;
            x.altName = "" + i;
        });
        return result;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    ngOnInit() {
        setTimeout(() => this.init(), 666);
    }
    /**
     * @param {?} item
     * @return {?}
     */
    categorizedName(item) {
        /** @type {?} */
        let name = "";
        this.categorizeBy.map((category) => {
            if (item.name === category) {
                name = item.value;
            }
        });
        return name;
    }
    /**
     * @param {?} side
     * @return {?}
     */
    sideCategorizedName(side) {
        side.map((item) => {
            /** @type {?} */
            const names = [];
            item.children.map((child) => {
                /** @type {?} */
                const name = this.categorizedName(child);
                if (String(name).length) {
                    names.push(name);
                }
            });
            item.categorizeBy = names.length > 1 ? names.join(" - ") : names[0];
            item.collapsed = true;
        });
    }
    /**
     * @return {?}
     */
    init() {
        if (this.leftSideObject && this.rightSideObject) {
            /** @type {?} */
            const left = (this.leftSideObject instanceof Array) ? this.leftSideObject : [this.leftSideObject];
            /** @type {?} */
            const right = (this.rightSideObject instanceof Array) ? this.rightSideObject : [this.rightSideObject];
            /** @type {?} */
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
            setTimeout(() => {
                this.ready = true;
                this.fireCountDifference();
            }, 333);
        }
    }
    /**
     * @return {?}
     */
    fireCountDifference() {
        /** @type {?} */
        let count = 0;
        this.leftSide[0].children.map((listItem) => {
            listItem.children.map((item) => {
                if (item.status !== DifferentiateNodeStatus.default) {
                    count++;
                }
            });
        });
        this.ondifference.emit(count);
    }
    /**
     * @param {?} side
     * @param {?} parentObject
     * @param {?} id
     * @return {?}
     */
    lookupChildOf(side, parentObject, id) {
        /** @type {?} */
        let foundItem = undefined;
        if (side.id === id) {
            foundItem = { parent: parentObject, node: side };
        }
        else if (side.children.length) {
            side.children.map((item) => {
                if (!foundItem) {
                    foundItem = this.lookupChildOf(item, undefined, id);
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
    }
    /**
     * @param {?} leftSideInfo
     * @param {?} rightSideInfo
     * @param {?} status
     * @param {?} i
     * @return {?}
     */
    performAdvanceToRight(leftSideInfo, rightSideInfo, status, i) {
        /** @type {?} */
        const modifiedChildren = this.leftSide[0].children[i].children;
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
        setTimeout(() => {
            this.onadvance.emit({
                index: i,
                node: this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
            });
            this.fireCountDifference();
        }, 66);
    }
    /**
     * @param {?} leftSideInfo
     * @param {?} rightSideInfo
     * @param {?} status
     * @param {?} i
     * @return {?}
     */
    performAdvanceToLeft(leftSideInfo, rightSideInfo, status, i) {
        /** @type {?} */
        const modifiedChildren = this.rightSide[0].children[i].children;
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
        setTimeout(() => {
            this.onrevert.emit({
                index: i,
                node: this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
            });
            this.fireCountDifference();
        }, 66);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    advance(event) {
        /** @type {?} */
        const index = parseInt(event.node.path.split(",")[1]);
        if (event.type === 'advance') {
            this.performAdvanceToLeft(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.id), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.counterpart), event.node.status, index);
        }
        else {
            this.performAdvanceToRight(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.counterpart), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.id), event.node.status, index);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    autoExpand(event) {
        /** @type {?} */
        const index = parseInt(event.split(",")[1]);
        /** @type {?} */
        const lc = this.rightSide[0].children[index];
        /** @type {?} */
        const rc = this.leftSide[0].children[index];
        lc.collapsed = !lc.collapsed;
        rc.collapsed = !rc.collapsed;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onhover(event) {
        /** @type {?} */
        const index = parseInt(event.path.split(",")[1]);
        this.rightSide[0].children[index].children[event.index].hover = event.hover;
        this.leftSide[0].children[index].children[event.index].hover = event.hover;
    }
}
DifferentiateComponent.decorators = [
    { type: Component, args: [{
                selector: 'differentiate',
                template: "<div class=\"spinner\" *ngIf=\"!ready\">\r\n    <svg \r\n        version=\"1.1\" \r\n        id=\"loader\" \r\n        xmlns=\"http://www.w3.org/2000/svg\" \r\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\" \r\n        x=\"0px\" \r\n        y=\"0px\"\r\n        width=\"40px\" \r\n        height=\"40px\" \r\n        viewBox=\"0 0 50 50\" \r\n        style=\"enable-background:new 0 0 50 50;\" \r\n        xml:space=\"preserve\">\r\n        <path \r\n            fill=\"#000\" \r\n            d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\r\n            <animateTransform attributeType=\"xml\"\r\n                attributeName=\"transform\"\r\n                type=\"rotate\"\r\n                from=\"0 25 25\"\r\n                to=\"360 25 25\"\r\n                dur=\"0.6s\"\r\n                repeatCount=\"indefinite\"/>\r\n    </path>\r\n  </svg>\r\n</div>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"left-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [rightSideToolTip]=\"rightSideToolTip\"\r\n    [showLeftActionButton]=\"allowAdvance\" \r\n    [children]=\"leftSide\"></differentiate-tree>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"right-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [leftSideToolTip]=\"leftSideToolTip\"\r\n    [showRightActionButton]=\"allowRevert\" \r\n    [children]=\"rightSide\"></differentiate-tree>\r\n\r\n",
                styles: [":host{border:1px solid rgba(0,0,0,.1);box-sizing:border-box;display:block;max-width:100vw;max-height:300px;overflow-y:auto;position:relative;width:100%}:host .spinner{margin:0 auto 1em;height:222px;width:20%;text-align:center;padding:1em;display:inline-block;vertical-align:top;position:absolute;top:0;left:10%;z-index:2}:host svg path,:host svg rect{fill:#1c0696}"]
            }] }
];
/** @nocollapse */
DifferentiateComponent.ctorParameters = () => [];
DifferentiateComponent.propDecorators = {
    allowRevert: [{ type: Input, args: ["allowRevert",] }],
    allowAdvance: [{ type: Input, args: ["allowAdvance",] }],
    attributeOrderIsImportant: [{ type: Input, args: ["attributeOrderIsImportant",] }],
    onlyShowDifferences: [{ type: Input, args: ["onlyShowDifferences",] }],
    leftSideObject: [{ type: Input, args: ["leftSideObject",] }],
    rightSideObject: [{ type: Input, args: ["rightSideObject",] }],
    leftSideToolTip: [{ type: Input, args: ["leftSideToolTip",] }],
    rightSideToolTip: [{ type: Input, args: ["rightSideToolTip",] }],
    namedRootObject: [{ type: Input, args: ['namedRootObject',] }],
    onrevert: [{ type: Output, args: ["onrevert",] }],
    onadvance: [{ type: Output, args: ["onadvance",] }],
    ondifference: [{ type: Output, args: ["ondifference",] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class DifferentiateTree {
    constructor() {
        this.collapsed = true;
        this.showLeftActionButton = false;
        this.showRightActionButton = false;
        this.status = 1;
        this.side = "";
        this.level = "0";
        this.objectPath = "";
        this.leftSideToolTip = "take left side";
        this.rightSideToolTip = "take right side";
        this.onhover = new EventEmitter();
        this.onrevert = new EventEmitter();
        this.onexpand = new EventEmitter();
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
     * @param {?} event
     * @return {?}
     */
    keyup(event) {
        /** @type {?} */
        const code = event.which;
        if (code === 13) {
            event.target.click();
        }
    }
    /**
     * @return {?}
     */
    changCounter() {
        /** @type {?} */
        let count = 0;
        this.children.map((item) => {
            if (item.status !== DifferentiateNodeStatus.default) {
                count++;
            }
        });
        return count;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    expand(event) {
        this.onexpand.emit(this.objectPath);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    autoExpand(event) {
        this.onexpand.emit(event);
    }
    /**
     * @param {?} child
     * @return {?}
     */
    advanceToRightSide(child) {
        child.path = this.objectPath + (this.objectPath.length ? ',' : '') + child.index;
        this.onrevert.emit({ type: "advance", node: child });
    }
    /**
     * @param {?} child
     * @return {?}
     */
    advanceToLeftSide(child) {
        child.path = this.objectPath + (this.objectPath.length ? ',' : '') + child.index;
        this.onrevert.emit({ type: "revert", node: child });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    advance(event) {
        // bubble up the undo event.
        this.onrevert.emit(event);
    }
    /**
     * @param {?} event
     * @param {?} flag
     * @param {?} i
     * @return {?}
     */
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
DifferentiateTree.decorators = [
    { type: Component, args: [{
                selector: 'differentiate-tree',
                template: "<div *ngIf=\"categorizeBy\" \r\n  class=\"diff-heading\" \r\n  (click)=\"expand($event)\">\r\n  <span class=\"arrow\" *ngIf=\"collapsed\">&#9658;</span>\r\n  <span class=\"arrow\" *ngIf=\"!collapsed\">&#9660;</span>\r\n  <span [textContent]=\"categorizeBy\"></span>\r\n  <span class=\"counter\" [textContent]=\"changCounter()\"></span>\r\n</div>\r\n<ul [class]=\"side\" [class.child]=\"depth ===2 || (categorizeBy && categorizeBy.length)\" [class.collapsed]=\"categorizeBy && collapsed\">\r\n  <li  *ngFor=\"let child of children\" \r\n    (mouseout)=\"depth === 2 ? mouseOvered($event, false, child.index) : null\"\r\n    (mouseover)=\"depth === 2 ? mouseOvered($event, true, child.index) : null\"\r\n    [class.hover]=\"child.hover\"\r\n    [class.added]=\"child.status === 5\" \r\n    [class.removed]=\"child.status === 6\" \r\n    [class.type-changed]=\"child.status === 2\" \r\n    [class.name-changed]=\"child.status === 3\" \r\n    [class.value-changed]=\"child.status === 4\">\r\n    <div \r\n      class='tree-node' \r\n      [ngClass]=\"'depth-' + depth\" \r\n      [class.left-action]=\"showLeftActionButton\"\r\n      [class.right-action]=\"showRightActionButton\" \r\n      [class.collapsed]=\"child.collapsed\" \r\n      [id] = \"child.id\">\r\n      <span [title]=\"rightSideToolTip\"\r\n        class=\"do\" \r\n        tabindex=\"0\"\r\n        aria-hidden=\"true\"\r\n        (keyup)=\"keyup($event)\"\r\n        (click)=\"advanceToRightSide(child)\"\r\n        *ngIf=\"showLeftActionButton && status !== child.status && child.status > 1\">&#9100;</span>\r\n      <span *ngIf='child.name && child.name!=null'\r\n        class='name' \r\n        [innerHTML]=\"child.name.length ? child.name : '&nbsp;'\">\r\n      </span>\r\n      <span *ngIf='child.value && child.value!=null'\r\n        class='value' \r\n        [class.string]=\"depth > 0 && child.value && child.value.length\"\r\n        [innerHTML]=\"child.value ? child.value : '&nbsp;'\">\r\n      </span>\r\n      <span [title]=\"leftSideToolTip\"\r\n        class=\"undo\" \r\n        tabindex=\"0\"\r\n        aria-hidden=\"true\"\r\n        (keyup)=\"keyup($event)\"\r\n        (click)=\"advanceToLeftSide(child)\"\r\n        *ngIf=\"showRightActionButton && status !== child.status && child.status > 1\">&#9100;</span>\r\n    </div>\r\n    <differentiate-tree *ngIf=\"child.children.length\" \r\n        [level]=\"depth+1\" \r\n        [status]=\"child.status\" \r\n        [collapsed]=\"child.collapsed\"\r\n        [categorizeBy]=\"child.categorizeBy\"\r\n        [showLeftActionButton]=\"showLeftActionButton\" \r\n        [leftSideToolTip]=\"leftSideToolTip\"\r\n        [showRightActionButton]=\"showRightActionButton\" \r\n        [rightSideToolTip]=\"rightSideToolTip\"\r\n        [objectPath]=\"objectPath + (objectPath.length ? ',':'') + child.index\"\r\n        (onhover)=\"bubleup($event)\"\r\n        (onrevert)=\"advance($event)\"\r\n        (onexpand)=\"autoExpand($event)\"\r\n        [class.child-node]=\"child.parent != 4\" \r\n        [children]='child.children'></differentiate-tree>\r\n    <div *ngIf=\"child.status > 2\" class=\"upper\" [class.collapsed]=\"child.collapsed\" [ngClass]=\"'depth-' + depth\" ></div>\r\n    <div *ngIf=\"child.status > 2\" class=\"lower\" [class.collapsed]=\"child.collapsed\" [ngClass]=\"'depth-' + depth\" ></div>\r\n  </li>\r\n</ul>\r\n\r\n",
                styles: [":host{box-sizing:border-box;width:100%}:host.root{float:left;width:50%}:host.child-node{float:left}.diff-heading{padding:5px;font-weight:700;background:rgba(0,0,0,.02);border-bottom:1px solid rgba(0,0,0,.1);color:#666;cursor:pointer}.diff-heading .arrow{color:#999;font-size:.6rem;font-weight:700}.diff-heading .counter{float:right;border-radius:50%;width:16px;text-align:center;background-color:rgba(0,0,0,.4);font-size:.8rem;color:#fff}.diff-heading:first-child{border-top:1px solid rgba(0,0,0,.1)}ul{box-sizing:border-box;list-style:none;padding:0;width:100%}ul .collapsed,ul.collapsed{display:none!important}ul li .hover{background-color:rgba(0,0,0,.1)}ul li .hover .do,ul li .hover .undo{color:#000!important}ul li .tree-node{position:relative}ul li .tree-node.depth-0{display:none}ul li .tree-node .do,ul li .tree-node .undo{cursor:pointer;color:#751e1e;position:absolute;text-align:center;top:0;width:18px;z-index:2;height:100%}ul li .tree-node .undo{right:0}ul li .tree-node .do{left:0}ul.undefined li:hover{background-color:rgba(0,0,0,.1)}ul.left-side{border-right:1px solid rgba(0,0,0,.1);margin:0}ul.left-side li{position:relative;display:table;width:100%}ul.left-side li .do{border-right:1px solid #ddd;font-size:1.3rem;line-height:1.3rem;-webkit-transform:scale(-1,1);transform:scale(-1,1)}ul.left-side li .tree-node.left-action:before{position:absolute;top:0;left:0;width:18px;z-index:1;background:rgba(0,0,0,.02);height:100%;border-right:1px solid #ddd;content:' ';display:block}ul.left-side li.added .name,ul.left-side li.added .value{opacity:.2;font-style:italic}ul.left-side li.added .upper{border-radius:0 0 100%;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;top:0;right:0}ul.left-side li.added .upper.depth-1{border:2px solid #245024;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-2{border:2px dotted #378637;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-3{border:1px solid #48ad48;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-4{border:1px dotted #57d657;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-5{border:1px dashed #67fa67;border-top-width:0;border-left-width:0}ul.left-side li.added .lower{border-radius:0 100% 0 0;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;bottom:0;right:0}ul.left-side li.added .lower.depth-1{border:2px solid #245024;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-2{border:2px dotted #378637;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-3{border:1px solid #48ad48;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-4{border:1px dotted #57d657;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-5{border:1px dashed #67fa67;border-bottom-width:0;border-left-width:0}ul.left-side li.removed .upper{box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.removed .upper:after{content:' - ';color:#962323;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.removed .lower{display:none}ul.left-side li.removed .tree-node span,ul.left-side li.type-changed .tree-node span{color:#962323}ul.left-side li.name-changed .upper{box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.name-changed .upper:after{content:' ~ ';color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.name-changed .tree-node .name{color:#000060}ul.left-side li.value-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:66px;top:0;right:0}ul.left-side li.value-changed .upper:after{content:' ~ ';color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.value-changed .tree-node .value{color:#000060}ul.right-side{border-left:1px solid rgba(0,0,0,.1);margin:0}ul.right-side li{position:relative;display:table;width:100%}ul.right-side li .undo{border-left:1px solid #ddd;font-size:1.3rem;line-height:1.3rem}ul.right-side li .tree-node.right-action:after{position:absolute;top:0;right:0;width:18px;z-index:1;background:rgba(0,0,0,.02);height:100%;border-left:1px solid #ddd;content:' ';display:block}ul.right-side li.added .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:90%;top:0;left:0}ul.right-side li.added .upper:after{content:'+';color:#4a4;font-weight:700;padding-left:5px;font-size:1.2rem;line-height:1.2rem}ul.right-side li.added .lower{display:none}ul.right-side li.added .tree-node span{color:#4a4}ul.right-side li.removed .name,ul.right-side li.removed .value{-webkit-text-decoration-line:line-through;text-decoration-line:line-through;-webkit-text-decoration-color:#962323;text-decoration-color:#962323}ul.right-side li.removed .upper{border-radius:0 0 0 100%;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;top:0}ul.right-side li.removed .upper.depth-1{border:2px solid #600000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-2{border:2px dotted maroon;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-3{border:1px solid #a00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-4{border:1px dotted #c00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-5{border:1px dashed #f00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .lower{border-radius:100% 0 0;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;bottom:0}ul.right-side li.removed .lower.depth-1{border:2px solid #600000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-2{border:2px dotted maroon;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-3{border:1px solid #a00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-4{border:1px dotted #c00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-5{border:1px dashed #f00000;border-bottom-width:0;border-right-width:0}ul.right-side li.type-changed .tree-node span{color:#962323}ul.right-side li.name-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.name-changed .upper:before{content:' ~ ';color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.name-changed .tree-node .name{color:#000060}ul.right-side li.value-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.value-changed .upper:before{content:' ~ ';color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.value-changed .tree-node .value{color:#000060}ul .tree-node{box-sizing:border-box;color:#7c9eb2;display:table;padding:0;position:relative;margin:0;width:100%}ul .tree-node.depth-0{padding-left:5px}ul .tree-node.depth-1{padding-left:20px}ul .tree-node.depth-2{padding-left:40px}ul .tree-node.depth-3{padding-left:60px}ul .tree-node.depth-4{padding-left:80px}ul .tree-node.depth-5{padding-left:100px}ul .tree-node.depth-6{padding-left:120px}ul .tree-node.depth-7{padding-left:140px}ul .tree-node.depth-8{padding-left:160px}ul .tree-node.depth-9{padding-left:180px}ul .tree-node.depth-10{padding-left:200px}ul .tree-node .name{color:#444;font-weight:700}ul .tree-node .name:after{content:':'}ul .tree-node .value.string:after,ul .tree-node .value.string:before{content:'\"'}"]
            }] }
];
DifferentiateTree.propDecorators = {
    collapsed: [{ type: Input, args: ["collapsed",] }],
    children: [{ type: Input, args: ["children",] }],
    showLeftActionButton: [{ type: Input, args: ["showLeftActionButton",] }],
    showRightActionButton: [{ type: Input, args: ["showRightActionButton",] }],
    status: [{ type: Input, args: ["status",] }],
    side: [{ type: Input, args: ["side",] }],
    level: [{ type: Input, args: ["level",] }],
    objectPath: [{ type: Input, args: ["objectPath",] }],
    categorizeBy: [{ type: Input, args: ["categorizeBy",] }],
    leftSideToolTip: [{ type: Input, args: ["leftSideToolTip",] }],
    rightSideToolTip: [{ type: Input, args: ["rightSideToolTip",] }],
    onhover: [{ type: Output, args: ["onhover",] }],
    onrevert: [{ type: Output, args: ["onrevert",] }],
    onexpand: [{ type: Output, args: ["onexpand",] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { DifferentiateComponent, DifferentiateTree, DifferentiateModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vZGlmZmVyZW50aWF0ZS9zcmMvYXBwL2RpZmZlcmVudGlhdGUvaW50ZXJmYWNlcy9kaWZmZXJlbnRpYXRlLmludGVyZmFjZXMudHMiLCJuZzovL2RpZmZlcmVudGlhdGUvc3JjL2FwcC9kaWZmZXJlbnRpYXRlL2NvbXBvbmVudHMvZGlmZmVyZW50aWF0ZS5jb21wb25lbnQudHMiLCJuZzovL2RpZmZlcmVudGlhdGUvc3JjL2FwcC9kaWZmZXJlbnRpYXRlL2NvbXBvbmVudHMvZGlmZmVyZW50aWF0ZS10cmVlLmNvbXBvbmVudC50cyIsIm5nOi8vZGlmZmVyZW50aWF0ZS9zcmMvYXBwL2RpZmZlcmVudGlhdGUvZGlmZmVyZW50aWF0ZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmV4cG9ydCBlbnVtIERpZmZlcmVudGlhdGVOb2RlVHlwZSB7XHJcbiAgbGl0ZXJhbCA9IDEsXHJcbiAgcGFpciA9IDIsXHJcbiAganNvbiA9IDMsXHJcbiAgYXJyYXkgPSA0XHJcbn1cclxuZXhwb3J0IGVudW0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMge1xyXG4gIGRlZmF1bHQgPSAxLFxyXG4gIHR5cGVDaGFuZ2VkID0gMixcclxuICBuYW1lQ2hhbmdlZCA9IDMsXHJcbiAgdmFsdWVDaGFuZ2VkID0gNCxcclxuICBhZGRlZCA9IDUsXHJcbiAgcmVtb3ZlZCA9IDZcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIERpZmZlcmVudGlhdGVOb2RlIHtcclxuICBpZDogbnVtYmVyLFxyXG4gIGNvdW50ZXJwYXJ0PzogbnVtYmVyLFxyXG4gIGluZGV4OiBudW1iZXIsXHJcbiAgbmFtZTogc3RyaW5nLFxyXG4gIGFsdE5hbWU6IHN0cmluZyxcclxuICB2YWx1ZTogc3RyaW5nLFxyXG4gIHBhcmVudDogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLFxyXG4gIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZSxcclxuICBjaGlsZHJlbjogRGlmZmVyZW50aWF0ZU5vZGVbXSxcclxuICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLFxyXG4gIGlzUm9vdD86IGJvb2xlYW5cclxufVxyXG5cclxuIiwiLypcclxuICogQ29tcGFyaXNpb24gVG9vbCB3aWxsIGxheW91dCB0d28gY29tcGFyaXNpb24gdHJlZXMgc2lkZSBieSBzaWRlIGFuZCBmZWVkIHRoZW0gYW4gaW50ZXJuYWwgb2JqZWN0XHJcbiAqIGhlaXJhcmNoeSBjcmVhdGVkIGZvciBpbnRlcm5hbCB1c2UgZnJvbSBKU09OIG9iamVjdHMgZ2l2ZW4gdG8gdGhpcyBjb21wb25lbnQuXHJcbiAqL1xyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgRGlmZmVyZW50aWF0ZU5vZGUsXHJcbiAgRGlmZmVyZW50aWF0ZU5vZGVUeXBlLFxyXG4gIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzXHJcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kaWZmZXJlbnRpYXRlLmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBUaHJvd1N0bXQgfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2RpZmZlcmVudGlhdGUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9kaWZmZXJlbnRpYXRlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kaWZmZXJlbnRpYXRlLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWZmZXJlbnRpYXRlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIFxyXG4gIGxlZnRTaWRlO1xyXG4gIHJpZ2h0U2lkZTtcclxuICByZWFkeTogYm9vbGVhbjtcclxuICBjYXRlZ29yaXplQnk6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJhbGxvd1JldmVydFwiKVxyXG4gIGFsbG93UmV2ZXJ0ID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcImFsbG93QWR2YW5jZVwiKVxyXG4gIGFsbG93QWR2YW5jZSA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoXCJhdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50XCIpXHJcbiAgYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCA9IHRydWU7XHJcblxyXG4gIEBJbnB1dChcIm9ubHlTaG93RGlmZmVyZW5jZXNcIilcclxuICBvbmx5U2hvd0RpZmZlcmVuY2VzID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcImxlZnRTaWRlT2JqZWN0XCIpXHJcbiAgbGVmdFNpZGVPYmplY3RcclxuXHJcbiAgQElucHV0KFwicmlnaHRTaWRlT2JqZWN0XCIpXHJcbiAgcmlnaHRTaWRlT2JqZWN0O1xyXG5cclxuICBASW5wdXQoXCJsZWZ0U2lkZVRvb2xUaXBcIilcclxuICBsZWZ0U2lkZVRvb2xUaXAgPSBcInRha2UgbGVmdCBzaWRlXCI7XHJcblxyXG4gIEBJbnB1dChcInJpZ2h0U2lkZVRvb2xUaXBcIilcclxuICByaWdodFNpZGVUb29sVGlwID0gXCJ0YWtlIHJpZ2h0IHNpZGVcIjtcclxuXHJcbiAgQElucHV0KCduYW1lZFJvb3RPYmplY3QnKVxyXG4gIHNldCBuYW1lZFJvb3RPYmplY3QodmFsdWU6IHN0cmluZykge1xyXG4gICAgbGV0IHggPSB2YWx1ZS5yZXBsYWNlKFwiIFwiLCBcIlwiKTtcclxuXHJcbiAgICBpZiAoeC5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5jYXRlZ29yaXplQnkgPSB2YWx1ZS5zcGxpdChcIixcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNhdGVnb3JpemVCeSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBPdXRwdXQoXCJvbnJldmVydFwiKVxyXG4gIG9ucmV2ZXJ0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25hZHZhbmNlXCIpXHJcbiAgb25hZHZhbmNlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25kaWZmZXJlbmNlXCIpXHJcbiAgb25kaWZmZXJlbmNlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcdCkge1xyXG5cdCAgXHJcbiAgfVxyXG4gIHByaXZhdGUgZ2VuZXJhdGVOb2RlSWQoKSB7XHJcbiAgICBjb25zdCBtaW4gPSAxO1xyXG4gICAgY29uc3QgbWF4ID0gMTAwMDBcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gIH1cclxuICBwcml2YXRlIHRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKG5vZGUsIHBhcmVudCkge1xyXG4gICAgbGV0IGpzb24gPSB7fTtcclxuICAgIGxldCBhcnJheSA9IFtdO1xyXG5cclxuICAgIG5vZGUubWFwKCAoaXRlbTogRGlmZmVyZW50aWF0ZU5vZGUpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uc3RhdHVzICE9PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKSB7XHJcbiAgICAgICAgaWYgKHBhcmVudCA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24pIHsgICAgXHJcbiAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5wYWlyKSB7XHJcbiAgICAgICAgICAgIGpzb25baXRlbS5uYW1lXSA9IGl0ZW0udmFsdWU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKGl0ZW0uY2hpbGRyZW4sIGl0ZW0ucGFyZW50KTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ubmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBqc29uW2l0ZW0ubmFtZV0gPSB4O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGpzb24gPSBbeF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbikge1xyXG4gICAgICAgICAgICBqc29uW2l0ZW0ubmFtZV0gPSB0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKGl0ZW0uY2hpbGRyZW4sIGl0ZW0ucGFyZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHBhcmVudCA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5KXtcclxuICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24pIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaCh0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKGl0ZW0sIGl0ZW0ucGFyZW50KSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5KSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShpdGVtLmNoaWxkcmVuLCBpdGVtLnBhcmVudCkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYXJyYXkubGVuZ3RoID8gYXJyYXkgOiBqc29uO1xyXG4gIH1cclxuICBwcml2YXRlIHRyYW5zZm9ybU5vZGVUb0ludGVybmFsU3RydWN0aW9uKG5vZGUpIHtcclxuICAgIGxldCByZXN1bHQgPSBub2RlO1xyXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICBjb25zdCBjaGlsZHJlbjogRGlmZmVyZW50aWF0ZU5vZGVbXSA9IFtdO1xyXG4gICAgICBjb25zdCBwID0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5O1xyXG4gICAgICBub2RlLm1hcCggKGl0ZW0sIGkpID0+IHtcclxuICAgICAgICBjb25zdCBqc29uVmFsdWU6IGFueSA9IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24oaXRlbSk7XHJcbiAgICAgICAgaWYgKGpzb25WYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCkge1xyXG4gICAgICAgICAgICBqc29uVmFsdWUuc29ydCgoYSxiKSA9PiB7cmV0dXJuIGEubmFtZSA8PSBiLm5hbWUgPyAtMTogMX0pO1xyXG4gICAgICAgICAgICBqc29uVmFsdWUubWFwKCAoeDogRGlmZmVyZW50aWF0ZU5vZGUsIGkpID0+e1xyXG4gICAgICAgICAgICAgIHguaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgIHguYWx0TmFtZSA9IFwiXCIgKyBpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgbmFtZTogXCJcIixcclxuICAgICAgICAgICAgYWx0TmFtZTogXCJcIiArIGksXHJcbiAgICAgICAgICAgIHZhbHVlOiBcIlwiLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHAsXHJcbiAgICAgICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjoganNvblZhbHVlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICBhbHROYW1lOiBcIlwiICsgaSxcclxuICAgICAgICAgICAgdmFsdWU6IGpzb25WYWx1ZSxcclxuICAgICAgICAgICAgcGFyZW50OiBwLFxyXG4gICAgICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCxcclxuICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gICAgICBcclxuICAgICAgfSk7XHJcbiAgICAgIHJlc3VsdCA9IGNoaWxkcmVuO1xyXG4gICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSBPYmplY3Qua2V5cyhub2RlKTtcclxuICAgICAgY29uc3QgY2hpbGRyZW46IERpZmZlcmVudGlhdGVOb2RlW10gPSBbXTtcclxuICAgICAgY29uc3QgcCA9IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uO1xyXG4gICAgICBpZiAoIXRoaXMuYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCkge1xyXG4gICAgICAgIGxpc3Quc29ydCgoYSxiKSA9PiB7cmV0dXJuIGEgPD0gYiA/IC0xOiAxfSk7XHJcbiAgICAgIH1cclxuICAgICAgbGlzdC5tYXAoIChpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgY29uc3QganNvblZhbHVlOiBhbnkgPSB0aGlzLnRyYW5zZm9ybU5vZGVUb0ludGVybmFsU3RydWN0aW9uKG5vZGVbaXRlbV0pO1xyXG4gICAgICAgIGlmIChqc29uVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnQpIHtcclxuICAgICAgICAgICAganNvblZhbHVlLnNvcnQoKGEsYikgPT4ge3JldHVybiBhLm5hbWUgPD0gYi5uYW1lID8gLTE6IDF9KTtcclxuICAgICAgICAgICAganNvblZhbHVlLm1hcCggKHg6IERpZmZlcmVudGlhdGVOb2RlLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgeC5pbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgeC5hbHROYW1lID0gXCJcIiArIGk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBuYW1lOiBpdGVtLFxyXG4gICAgICAgICAgICBhbHROYW1lOiBcIlwiICsgaSxcclxuICAgICAgICAgICAgdmFsdWU6IFwiXCIsXHJcbiAgICAgICAgICAgIHBhcmVudDogcCxcclxuICAgICAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24sXHJcbiAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCxcclxuICAgICAgICAgICAgY2hpbGRyZW46IGpzb25WYWx1ZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgbmFtZTogaXRlbSxcclxuICAgICAgICAgICAgYWx0TmFtZTogXCJcIiArIGksXHJcbiAgICAgICAgICAgIHZhbHVlOiBqc29uVmFsdWUsXHJcbiAgICAgICAgICAgIHBhcmVudDogcCxcclxuICAgICAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLnBhaXIsXHJcbiAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCxcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtdXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXN1bHQgPSBjaGlsZHJlbjtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGl0ZW1JbkFycmF5KHNpZGU6IERpZmZlcmVudGlhdGVOb2RlW10sIG5vZGU6IERpZmZlcmVudGlhdGVOb2RlKSB7XHJcbiAgICBsZXQgcmVzdWx0OiBEaWZmZXJlbnRpYXRlTm9kZTtcclxuICAgIGNvbnN0IGtleSA9IG5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwgP1xyXG4gICAgICAgICAgICAgICAgKG5vZGUudmFsdWUgPyBTdHJpbmcobm9kZS52YWx1ZSkudG9VcHBlckNhc2UoKSA6IFwiXCIpIDpcclxuICAgICAgICAgICAgICAgIG5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5ID9cclxuICAgICAgICAgICAgICAgIG5vZGUuYWx0TmFtZSA6XHJcbiAgICAgICAgICAgICAgICBub2RlLm5hbWU7XHJcblxyXG4gICAgc2lkZS5tYXAoIChpdGVtOiBEaWZmZXJlbnRpYXRlTm9kZSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICAgIGlmIChpdGVtLnZhbHVlICYmIFN0cmluZyhpdGVtLnZhbHVlKS50b1VwcGVyQ2FzZSgpID09PSBrZXkpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGl0ZW07XHJcbiAgICAgICAgfSAgXHJcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpIHtcclxuICAgICAgICBpZiAoaXRlbS5hbHROYW1lID09PSBrZXkpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGl0ZW07XHJcbiAgICAgICAgfSAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0ga2V5KSB7XHJcbiAgICAgICAgICByZXN1bHQgPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsZWZ0SXRlbUZyb21SaWdodEl0ZW0obGVmdE5vZGU6IERpZmZlcmVudGlhdGVOb2RlLCByaWdodE5vZGU6IERpZmZlcmVudGlhdGVOb2RlKSB7XHJcbiAgICBsZXQgcmVzdWx0OiBEaWZmZXJlbnRpYXRlTm9kZTtcclxuICAgIGlmICghbGVmdE5vZGUgfHwgIXJpZ2h0Tm9kZSkge1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgY29uc3Qga2V5ID0gcmlnaHROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsID9cclxuICAgICAgICAgICAgICAgICAgICAocmlnaHROb2RlLnZhbHVlID8gcmlnaHROb2RlLnZhbHVlLnRvVXBwZXJDYXNlKCkgOiBcIlwiKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSA/XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHROb2RlLmFsdE5hbWUgOlxyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0Tm9kZS5uYW1lO1xyXG5cclxuICAgIGlmIChsZWZ0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICBpZiAobGVmdE5vZGUudmFsdWUgJiYgU3RyaW5nKGxlZnROb2RlLnZhbHVlKS50b1VwcGVyQ2FzZSgpID09PSBrZXkpIHtcclxuICAgICAgICByZXN1bHQgPSBsZWZ0Tm9kZTtcclxuICAgICAgfSAgXHJcbiAgICB9IGVsc2UgaWYgKGxlZnROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSkge1xyXG4gICAgICBpZiAobGVmdE5vZGUuYWx0TmFtZSA9PT0ga2V5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbGVmdE5vZGU7XHJcbiAgICAgIH0gIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGxlZnROb2RlLm5hbWUgPT09IGtleSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGxlZnROb2RlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb21wYXJlKGxlZnROb2RlOiBEaWZmZXJlbnRpYXRlTm9kZSwgcmlnaHROb2RlOiBEaWZmZXJlbnRpYXRlTm9kZSkge1xyXG4gICAgaWYgKGxlZnROb2RlLnR5cGUgIT09IHJpZ2h0Tm9kZS50eXBlKSB7XHJcbiAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnR5cGVDaGFuZ2VkO1xyXG4gICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudHlwZUNoYW5nZWQ7XHJcbiAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgIH0gZWxzZSBpZiAobGVmdE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwpIHtcclxuICAgICAgaWYgKGxlZnROb2RlLnZhbHVlICE9PSByaWdodE5vZGUudmFsdWUpIHtcclxuICAgICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZDtcclxuICAgICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChsZWZ0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUucGFpcikge1xyXG4gICAgICBpZiAobGVmdE5vZGUubmFtZSAhPT0gcmlnaHROb2RlLm5hbWUpIHtcclxuICAgICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZDtcclxuICAgICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQ7XHJcbiAgICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxlZnROb2RlLnZhbHVlICE9PSByaWdodE5vZGUudmFsdWUpIHtcclxuICAgICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZDtcclxuICAgICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGxlZnROb2RlLm5hbWUgIT09IHJpZ2h0Tm9kZS5uYW1lKSB7XHJcbiAgICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkO1xyXG4gICAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudW5pZnkobGVmdE5vZGUuY2hpbGRyZW4sIHJpZ2h0Tm9kZS5jaGlsZHJlbik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgcmVJbmRleChsaXN0OiBEaWZmZXJlbnRpYXRlTm9kZVtdKSB7XHJcbiAgICBsaXN0Lm1hcCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICBpdGVtLmluZGV4ID0gaTtcclxuICAgICAgdGhpcy5yZUluZGV4KGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgY29weUludG8oXHJcbiAgICAgICAgICAgICAgc2lkZTogRGlmZmVyZW50aWF0ZU5vZGVbXSxcclxuICAgICAgICAgICAgICBpdGVtOiBEaWZmZXJlbnRpYXRlTm9kZSxcclxuICAgICAgICAgICAgICBpbmRleDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMpIHtcclxuICAgIFxyXG4gICAgaWYgKGl0ZW0pIHtcclxuICAgICAgY29uc3QgbmV3SXRlbSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaXRlbSkpO1xyXG4gICAgICBzaWRlLnNwbGljZShpbmRleCwgMCwgbmV3SXRlbSk7XHJcbiAgICAgIHRoaXMucmVJbmRleChzaWRlKTtcclxuICBcclxuICAgICAgaXRlbS5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgIG5ld0l0ZW0uc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICBpdGVtLmNvdW50ZXJwYXJ0ID0gbmV3SXRlbS5pZDtcclxuICAgICAgbmV3SXRlbS5jb3VudGVycGFydCA9IGl0ZW0uaWQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMoaXRlbS5jaGlsZHJlbiwgc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKG5ld0l0ZW0uY2hpbGRyZW4sIHN0YXR1cylcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSBzZXRDaGlsZHJlblN0YXR1cyhsaXN0LCBzdGF0dXMpe1xyXG4gICAgbGlzdC5tYXAoICh4KSA9PiB7XHJcbiAgICAgIHguc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHguY2hpbGRyZW4sIHN0YXR1cylcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIHVuaWZ5KGxlZnRTaWRlOiBEaWZmZXJlbnRpYXRlTm9kZVtdLCByaWdodFNpZGU6IERpZmZlcmVudGlhdGVOb2RlW10pIHtcclxuICAgIGxldCBpID0gMCwgaiA9IDAsIGxvb3BpbmcgPSB0cnVlO1xyXG5cclxuICAgIHdoaWxlIChsb29waW5nKSB7XHJcbiAgICAgIGxldCBsZWZ0SXRlbUluUmlnaHRTaWRlOiBEaWZmZXJlbnRpYXRlTm9kZSA9IGkgPCBsZWZ0U2lkZS5sZW5ndGggPyB0aGlzLml0ZW1JbkFycmF5KHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0pIDogdW5kZWZpbmVkO1xyXG4gICAgICBsZXQgcmlnaHRJdGVtSW5MZWZ0U2lkZTogRGlmZmVyZW50aWF0ZU5vZGUgPSBqIDwgcmlnaHRTaWRlLmxlbmd0aCA/IHRoaXMuaXRlbUluQXJyYXkobGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSkgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICBpZiAoIWxlZnRJdGVtSW5SaWdodFNpZGUgJiYgaSA8IGxlZnRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICghcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgd2hpbGUgKGkgPCBsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghcmlnaHRJdGVtSW5MZWZ0U2lkZSAmJiBqIDwgcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICghbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICB3aGlsZSAoaiA8IHJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFsZWZ0SXRlbUluUmlnaHRTaWRlKSB7XHJcbiAgICAgICAgbGVmdEl0ZW1JblJpZ2h0U2lkZSA9IGogPCByaWdodFNpZGUubGVuZ3RoID8gcmlnaHRTaWRlW2pdIDogdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghcmlnaHRJdGVtSW5MZWZ0U2lkZSkge1xyXG4gICAgICAgIHJpZ2h0SXRlbUluTGVmdFNpZGUgPSBpIDwgbGVmdFNpZGUubGVuZ3RoID8gbGVmdFNpZGVbaV0gOiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxlZnRJdGVtSW5SaWdodFNpZGUgJiYgbGVmdEl0ZW1JblJpZ2h0U2lkZS5pbmRleCAhPT0gaSkge1xyXG4gICAgICAgIHdoaWxlIChpIDwgbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICBsZWZ0SXRlbUluUmlnaHRTaWRlID0gdGhpcy5sZWZ0SXRlbUZyb21SaWdodEl0ZW0ocmlnaHRTaWRlW2ldLCBsZWZ0U2lkZVtpXSk7XHJcbiAgICAgICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSkge1xyXG4gICAgICAgICAgICBsZWZ0SXRlbUluUmlnaHRTaWRlID0gaiA8IHJpZ2h0U2lkZS5sZW5ndGggPyByaWdodFNpZGVbal0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ICBcclxuICAgICAgfVxyXG4gICAgICBpZiAocmlnaHRJdGVtSW5MZWZ0U2lkZSAmJiByaWdodEl0ZW1JbkxlZnRTaWRlLmluZGV4ICE9PSBqKSB7XHJcbiAgICAgICAgd2hpbGUgKGogPCByaWdodFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gdGhpcy5sZWZ0SXRlbUZyb21SaWdodEl0ZW0obGVmdFNpZGVbal0sIHJpZ2h0U2lkZVtqXSk7XHJcbiAgICAgICAgICBpZiAocmlnaHRJdGVtSW5MZWZ0U2lkZSkge1xyXG4gICAgICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gaSA8IGxlZnRTaWRlLmxlbmd0aCA/IGxlZnRTaWRlW2ldIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiBpIDwgbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgbGV0IHggPSB0aGlzLml0ZW1JbkFycmF5KHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0pO1xyXG4gICAgICAgIGlmICh4ICYmIHguaW5kZXggIT09IGxlZnRJdGVtSW5SaWdodFNpZGUuaW5kZXgpIHtcclxuICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIGxlZnRJdGVtSW5SaWdodFNpZGUgPSBqIDwgcmlnaHRTaWRlLmxlbmd0aCA/IHJpZ2h0U2lkZVtqXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHJpZ2h0SXRlbUluTGVmdFNpZGUgJiYgaiA8IHJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICBsZXQgeCA9IHRoaXMuaXRlbUluQXJyYXkobGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSk7XHJcbiAgICAgICAgaWYgKHggJiYgeC5pbmRleCAhPT0gcmlnaHRJdGVtSW5MZWZ0U2lkZS5pbmRleCkge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gaSA8IGxlZnRTaWRlLmxlbmd0aCA/IGxlZnRTaWRlW2ldIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiByaWdodEl0ZW1JbkxlZnRTaWRlKSB7XHJcbiAgICAgICAgaWYgKGxlZnRJdGVtSW5SaWdodFNpZGUucGFyZW50ICE9PSByaWdodEl0ZW1JbkxlZnRTaWRlLnBhcmVudCkge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNvbXBhcmUobGVmdEl0ZW1JblJpZ2h0U2lkZSwgcmlnaHRJdGVtSW5MZWZ0U2lkZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGorKztpKys7XHJcbiAgICAgIH1cclxuICAgICAgbG9vcGluZyA9IChpIDwgbGVmdFNpZGUubGVuZ3RoIHx8IGogPCByaWdodFNpZGUubGVuZ3RoKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSB0b0ludGVybmFsU3RydWN0aW9uKGxlZnROb2RlLCByaWdodE5vZGUpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHtcclxuICAgICAgbGVmdFNpZGU6IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24obGVmdE5vZGUpLFxyXG4gICAgICByaWdodFNpZGU6IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24ocmlnaHROb2RlKVxyXG4gICAgfTtcclxuICAgIHRoaXMudW5pZnkocmVzdWx0LmxlZnRTaWRlLCByZXN1bHQucmlnaHRTaWRlKTtcclxuXHJcbiAgICBpZiAodGhpcy5vbmx5U2hvd0RpZmZlcmVuY2VzKSB7XHJcbiAgICAgIHJlc3VsdC5sZWZ0U2lkZSA9IHRoaXMuZmlsdGVyVW5jaGFuZ2VkKHJlc3VsdC5sZWZ0U2lkZSk7XHJcbiAgICAgIHJlc3VsdC5yaWdodFNpZGUgPSB0aGlzLmZpbHRlclVuY2hhbmdlZChyZXN1bHQucmlnaHRTaWRlKTtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHByaXZhdGUgZmlsdGVyVW5jaGFuZ2VkKGxpc3Q6IERpZmZlcmVudGlhdGVOb2RlW10pIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgXHJcbiAgICBsaXN0Lm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgaXRlbS5jaGlsZHJlbiA9IHRoaXMuZmlsdGVyVW5jaGFuZ2VkKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICBpZiAoKGl0ZW0udHlwZSA+IERpZmZlcmVudGlhdGVOb2RlVHlwZS5wYWlyICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoKSB8fFxyXG4gICAgICAgICAgaXRlbS5zdGF0dXMgIT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQpIHtcclxuICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXN1bHQubWFwKCAoeDogRGlmZmVyZW50aWF0ZU5vZGUsIGkpID0+IHtcclxuICAgICAgeC5pbmRleCA9IGk7XHJcbiAgICAgIHguYWx0TmFtZSA9IFwiXCIgKyBpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xyXG4gICAgaWYgKGNoYW5nZXMuYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCB8fFxyXG4gICAgICBjaGFuZ2VzLm9ubHlTaG93RGlmZmVyZW5jZXMgfHxcclxuICAgICAgY2hhbmdlcy5sZWZ0U2lkZU9iamVjdCB8fFxyXG4gICAgICBjaGFuZ2VzLm5hbWVkUm9vdE9iamVjdCB8fFxyXG4gICAgICBjaGFuZ2VzLnJpZ2h0U2lkZU9iamVjdCkge1xyXG4gICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubmdPbkluaXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgc2V0VGltZW91dCgoKT0+dGhpcy5pbml0KCksNjY2KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBjYXRlZ29yaXplZE5hbWUoaXRlbSkge1xyXG4gICAgbGV0IG5hbWUgPSBcIlwiO1xyXG4gICAgdGhpcy5jYXRlZ29yaXplQnkubWFwKChjYXRlZ29yeSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5uYW1lID09PSBjYXRlZ29yeSkge1xyXG4gICAgICAgIG5hbWUgPSBpdGVtLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuYW1lO1xyXG4gIH1cclxuICBwcml2YXRlIHNpZGVDYXRlZ29yaXplZE5hbWUoc2lkZSkge1xyXG4gICAgc2lkZS5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5hbWVzID0gW107XHJcbiAgICAgIGl0ZW0uY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNhdGVnb3JpemVkTmFtZShjaGlsZCk7XHJcbiAgICAgICAgaWYoU3RyaW5nKG5hbWUpLmxlbmd0aCkge1xyXG4gICAgICAgICAgbmFtZXMucHVzaChuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBpdGVtLmNhdGVnb3JpemVCeSA9IG5hbWVzLmxlbmd0aCA+IDEgPyBuYW1lcy5qb2luKFwiIC0gXCIpIDogbmFtZXNbMF07XHJcbiAgICAgIGl0ZW0uY29sbGFwc2VkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5sZWZ0U2lkZU9iamVjdCAmJiB0aGlzLnJpZ2h0U2lkZU9iamVjdCkge1xyXG4gICAgICBjb25zdCBsZWZ0ID0gKHRoaXMubGVmdFNpZGVPYmplY3QgaW5zdGFuY2VvZiBBcnJheSkgID8gdGhpcy5sZWZ0U2lkZU9iamVjdCA6IFt0aGlzLmxlZnRTaWRlT2JqZWN0XVxyXG4gICAgICBjb25zdCByaWdodCA9ICh0aGlzLnJpZ2h0U2lkZU9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSAgPyB0aGlzLnJpZ2h0U2lkZU9iamVjdCA6IFt0aGlzLnJpZ2h0U2lkZU9iamVjdF1cclxuICAgICAgY29uc3QgY29tcGFyaXNpb24gPSB0aGlzLnRvSW50ZXJuYWxTdHJ1Y3Rpb24obGVmdCwgcmlnaHQpO1xyXG4gICAgICBpZiAodGhpcy5jYXRlZ29yaXplQnkpIHtcclxuICAgICAgICB0aGlzLnNpZGVDYXRlZ29yaXplZE5hbWUoY29tcGFyaXNpb24ubGVmdFNpZGUpO1xyXG4gICAgICAgIHRoaXMuc2lkZUNhdGVnb3JpemVkTmFtZShjb21wYXJpc2lvbi5yaWdodFNpZGUpO1xyXG4gICAgICB9ICBcclxuICAgICAgdGhpcy5sZWZ0U2lkZSA9IFt7XHJcbiAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgIHZhbHVlOiBcIlJvb3RcIixcclxuICAgICAgICBpbmRleDogMCxcclxuICAgICAgICBwYXJlbnQ6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgZXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgICAgaXNSb290OiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjb21wYXJpc2lvbi5sZWZ0U2lkZVxyXG4gICAgICB9XTtcclxuICAgICAgdGhpcy5yaWdodFNpZGU9IFt7XHJcbiAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgIHZhbHVlOiBcIlJvb3RcIixcclxuICAgICAgICBpbmRleDogMCxcclxuICAgICAgICBwYXJlbnQ6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgZXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgICAgaXNSb290OiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjb21wYXJpc2lvbi5yaWdodFNpZGVcclxuICAgICAgfV07XHJcbiAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDb3VudERpZmZlcmVuY2UoKTtcclxuICAgICAgfSwzMzMpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIGZpcmVDb3VudERpZmZlcmVuY2UoKSB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgdGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbi5tYXAoIChsaXN0SXRlbSkgPT4ge1xyXG4gICAgICBsaXN0SXRlbS5jaGlsZHJlbi5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgaWYoaXRlbS5zdGF0dXMgIT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQpIHtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICB0aGlzLm9uZGlmZmVyZW5jZS5lbWl0KGNvdW50KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBsb29rdXBDaGlsZE9mKHNpZGUsIHBhcmVudE9iamVjdCwgaWQpIHtcclxuICAgIGxldCBmb3VuZEl0ZW0gPSB1bmRlZmluZWQ7XHJcbiAgICBpZiAoc2lkZS5pZCA9PT0gaWQpIHtcclxuICAgICAgZm91bmRJdGVtID0ge3BhcmVudDogcGFyZW50T2JqZWN0LCBub2RlOiBzaWRlfTtcclxuICAgIH0gZWxzZSBpZiAoc2lkZS5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgc2lkZS5jaGlsZHJlbi5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgaWYgKCFmb3VuZEl0ZW0pIHtcclxuICAgICAgICAgIGZvdW5kSXRlbSA9IHRoaXMubG9va3VwQ2hpbGRPZihpdGVtLCB1bmRlZmluZWQsIGlkKTtcclxuICAgICAgICAgIGlmIChmb3VuZEl0ZW0gJiYgZm91bmRJdGVtLnBhcmVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvdW5kSXRlbS5wYXJlbnQgPSBzaWRlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlkID09PSBpZCkge1xyXG4gICAgICAgICAgICBmb3VuZEl0ZW0gPSB7cGFyZW50OiBzaWRlLCBub2RlOiBpdGVtfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBcclxuICAgIHJldHVybiBmb3VuZEl0ZW07XHJcbiAgfVxyXG4gIHByaXZhdGUgcGVyZm9ybUFkdmFuY2VUb1JpZ2h0KGxlZnRTaWRlSW5mbywgcmlnaHRTaWRlSW5mbywgc3RhdHVzLCBpKSB7XHJcbiAgICBjb25zdCBtb2RpZmllZENoaWxkcmVuID0gdGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpXS5jaGlsZHJlbjtcclxuICAgIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UobGVmdFNpZGVJbmZvLm5vZGUuaW5kZXgsIDEpO1xyXG4gICAgICByaWdodFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UocmlnaHRTaWRlSW5mby5ub2RlLmluZGV4LCAxKTtcclxuICAgICAgdGhpcy5yZUluZGV4KGxlZnRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgICB0aGlzLnJlSW5kZXgocmlnaHRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLm5hbWUgPSByaWdodFNpZGVJbmZvLm5vZGUubmFtZTtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkKSB7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS52YWx1ZSA9IGxlZnRTaWRlSW5mby5ub2RlLnZhbHVlO1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy50eXBlQ2hhbmdlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS50eXBlID0gcmlnaHRTaWRlSW5mby5ub2RlLnR5cGU7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuID0gcmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKSA9PntcclxuICAgICAgdGhpcy5vbmFkdmFuY2UuZW1pdCh7XHJcbiAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgbm9kZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShtb2RpZmllZENoaWxkcmVuLCBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbilcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZmlyZUNvdW50RGlmZmVyZW5jZSgpO1xyXG4gICAgfSwgNjYpO1xyXG4gIH1cclxuICBwcml2YXRlIHBlcmZvcm1BZHZhbmNlVG9MZWZ0KGxlZnRTaWRlSW5mbywgcmlnaHRTaWRlSW5mbywgc3RhdHVzLCBpKSB7XHJcbiAgICBjb25zdCBtb2RpZmllZENoaWxkcmVuID0gdGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baV0uY2hpbGRyZW47XHJcbiAgICBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGxlZnRTaWRlSW5mby5ub2RlLmluZGV4LCAxKTtcclxuICAgICAgcmlnaHRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKHJpZ2h0U2lkZUluZm8ubm9kZS5pbmRleCwgMSk7XHJcbiAgICAgIHRoaXMucmVJbmRleChsZWZ0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuKTtcclxuICAgICAgdGhpcy5yZUluZGV4KHJpZ2h0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuKTtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZCkge1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUubmFtZSA9IGxlZnRTaWRlSW5mby5ub2RlLm5hbWU7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS52YWx1ZSA9IHJpZ2h0U2lkZUluZm8ubm9kZS52YWx1ZTtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudHlwZUNoYW5nZWQpIHtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnR5cGUgPSBsZWZ0U2lkZUluZm8ubm9kZS50eXBlO1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4gPSBsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbjtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoKCkgPT57XHJcbiAgICAgIHRoaXMub25yZXZlcnQuZW1pdCh7XHJcbiAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgbm9kZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShtb2RpZmllZENoaWxkcmVuLCBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbilcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZmlyZUNvdW50RGlmZmVyZW5jZSgpO1xyXG4gICAgfSwgNjYpO1xyXG4gIH1cclxuICBhZHZhbmNlKGV2ZW50KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KGV2ZW50Lm5vZGUucGF0aC5zcGxpdChcIixcIilbMV0pO1xyXG5cclxuICAgIGlmIChldmVudC50eXBlID09PSAnYWR2YW5jZScpIHtcclxuICAgICAgdGhpcy5wZXJmb3JtQWR2YW5jZVRvTGVmdChcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMubGVmdFNpZGVbMF0sIGV2ZW50Lm5vZGUuaWQpLCBcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLCB0aGlzLnJpZ2h0U2lkZVswXSwgZXZlbnQubm9kZS5jb3VudGVycGFydCksIFxyXG4gICAgICAgIGV2ZW50Lm5vZGUuc3RhdHVzLCBpbmRleCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBlcmZvcm1BZHZhbmNlVG9SaWdodChcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMubGVmdFNpZGVbMF0sIGV2ZW50Lm5vZGUuY291bnRlcnBhcnQpLCBcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLCB0aGlzLnJpZ2h0U2lkZVswXSwgZXZlbnQubm9kZS5pZCksIFxyXG4gICAgICAgIGV2ZW50Lm5vZGUuc3RhdHVzLCBpbmRleCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGF1dG9FeHBhbmQoZXZlbnQpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoZXZlbnQuc3BsaXQoXCIsXCIpWzFdKTtcclxuICAgIGNvbnN0IGxjID0gdGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdO1xyXG4gICAgY29uc3QgcmMgPSB0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIFxyXG4gICAgbGMuY29sbGFwc2VkID0gIWxjLmNvbGxhcHNlZDtcclxuICAgIHJjLmNvbGxhcHNlZCA9ICFyYy5jb2xsYXBzZWQ7XHJcbiAgfVxyXG4gIG9uaG92ZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoZXZlbnQucGF0aC5zcGxpdChcIixcIilbMV0pO1xyXG5cclxuICAgIHRoaXMucmlnaHRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XS5jaGlsZHJlbltldmVudC5pbmRleF0uaG92ZXIgPSBldmVudC5ob3ZlcjtcclxuICAgIHRoaXMubGVmdFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLmNoaWxkcmVuW2V2ZW50LmluZGV4XS5ob3ZlciA9IGV2ZW50LmhvdmVyO1xyXG4gIH1cclxufVxyXG4iLCIvKlxyXG4gKiBBIGNvbXBhcmlzaW9uIHRyZWUgd2lsbCBsYXlvdXQgZWFjaCBhdHRyaWJ1dGUgb2YgYSBqc29uIGRlZXAgdGhyb3VnaCBpdHMgaGVpcmFyY2h5IHdpdGggZ2l2ZW4gdmlzdWFsIHF1ZXVlc1xyXG4gKiB0aGF0IHJlcHJlc2VudHMgYSBkZWxldGlvbiwgYWRpdGlvbiwgb3IgY2hhbmdlIG9mIGF0dHJpYnV0ZSBmcm9tIHRoZSBvdGhlciB0cmVlLiBUaGUgc3RhdHVzIG9mIGVhY2ggbm9kZSBpcyBcclxuICogZXZhbHVhdGVkIGJ5IHRoZSBwYXJlbnQgY29tcGFyaXNpb24gdG9vbC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge0RpZmZlcmVudGlhdGVOb2RlU3RhdHVzfSBmcm9tICcuLi9pbnRlcmZhY2VzL2RpZmZlcmVudGlhdGUuaW50ZXJmYWNlcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2RpZmZlcmVudGlhdGUtdHJlZScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RpZmZlcmVudGlhdGUtdHJlZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGlmZmVyZW50aWF0ZS10cmVlLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWZmZXJlbnRpYXRlVHJlZSBpbXBsZW1lbnRzIE9uSW5pdHtcclxuICBkZXB0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJjb2xsYXBzZWRcIilcclxuICBjb2xsYXBzZWQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoXCJjaGlsZHJlblwiKVxyXG4gIGNoaWxkcmVuO1xyXG5cclxuICBASW5wdXQoXCJzaG93TGVmdEFjdGlvbkJ1dHRvblwiKVxyXG4gIHNob3dMZWZ0QWN0aW9uQnV0dG9uID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcInNob3dSaWdodEFjdGlvbkJ1dHRvblwiKVxyXG4gIHNob3dSaWdodEFjdGlvbkJ1dHRvbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoXCJzdGF0dXNcIilcclxuICBzdGF0dXMgPSAxO1xyXG5cclxuICBASW5wdXQoXCJzaWRlXCIpXHJcbiAgc2lkZSA9IFwiXCI7XHJcblxyXG4gIEBJbnB1dChcImxldmVsXCIpXHJcbiAgbGV2ZWwgPSBcIjBcIjtcclxuXHJcbiAgQElucHV0KFwib2JqZWN0UGF0aFwiKVxyXG4gIG9iamVjdFBhdGggPSBcIlwiO1xyXG5cclxuICBASW5wdXQoXCJjYXRlZ29yaXplQnlcIilcclxuICBjYXRlZ29yaXplQnk6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwibGVmdFNpZGVUb29sVGlwXCIpXHJcbiAgbGVmdFNpZGVUb29sVGlwID0gXCJ0YWtlIGxlZnQgc2lkZVwiO1xyXG5cclxuICBASW5wdXQoXCJyaWdodFNpZGVUb29sVGlwXCIpXHJcbiAgcmlnaHRTaWRlVG9vbFRpcCA9IFwidGFrZSByaWdodCBzaWRlXCI7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmhvdmVyXCIpXHJcbiAgb25ob3ZlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9ucmV2ZXJ0XCIpXHJcbiAgb25yZXZlcnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmV4cGFuZFwiKVxyXG4gIG9uZXhwYW5kID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZGVwdGggPSBwYXJzZUludCh0aGlzLmxldmVsKTtcclxuICB9XHJcblxyXG4gIGJ1YmxldXAoZXZlbnQpIHtcclxuICAgIGV2ZW50LnNpZGUgPSB0aGlzLnNpZGU7XHJcbiAgICB0aGlzLm9uaG92ZXIuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBrZXl1cChldmVudCkge1xyXG4gICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgaWYgKGNvZGUgPT09IDEzKSB7XHJcbiAgICAgIGV2ZW50LnRhcmdldC5jbGljaygpO1xyXG5cdFx0fVxyXG4gIH1cclxuXHJcbiAgY2hhbmdDb3VudGVyKCkge1xyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIHRoaXMuY2hpbGRyZW4ubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICBpZihpdGVtLnN0YXR1cyAhPT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCkge1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gY291bnQ7XHJcbiAgfVxyXG5cclxuICBleHBhbmQoZXZlbnQpIHtcclxuICAgIHRoaXMub25leHBhbmQuZW1pdCggdGhpcy5vYmplY3RQYXRoICk7XHJcbiAgfVxyXG4gIGF1dG9FeHBhbmQoZXZlbnQpIHtcclxuICAgIHRoaXMub25leHBhbmQuZW1pdChldmVudCk7XHJcbiAgfVxyXG4gIGFkdmFuY2VUb1JpZ2h0U2lkZShjaGlsZCkge1xyXG4gICAgY2hpbGQucGF0aCA9IHRoaXMub2JqZWN0UGF0aCArICh0aGlzLm9iamVjdFBhdGgubGVuZ3RoID8gJywnOicnKSArIGNoaWxkLmluZGV4O1xyXG4gICAgdGhpcy5vbnJldmVydC5lbWl0KHt0eXBlOlwiYWR2YW5jZVwiLCBub2RlOiBjaGlsZH0pO1xyXG4gIH1cclxuICBhZHZhbmNlVG9MZWZ0U2lkZShjaGlsZCkge1xyXG4gICAgY2hpbGQucGF0aCA9IHRoaXMub2JqZWN0UGF0aCArICh0aGlzLm9iamVjdFBhdGgubGVuZ3RoID8gJywnOicnKSArIGNoaWxkLmluZGV4O1xyXG4gICAgdGhpcy5vbnJldmVydC5lbWl0KHt0eXBlOlwicmV2ZXJ0XCIsIG5vZGU6IGNoaWxkfSk7XHJcbiAgfVxyXG4gIGFkdmFuY2UoZXZlbnQpIHtcclxuICAgIC8vIGJ1YmJsZSB1cCB0aGUgdW5kbyBldmVudC5cclxuICAgIHRoaXMub25yZXZlcnQuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBtb3VzZU92ZXJlZChldmVudCwgZmxhZywgaSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5kZXB0aCA9PT0gMikge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMub25ob3Zlci5lbWl0KHtcclxuICAgICAgICBob3ZlcjogZmxhZyxcclxuICAgICAgICBpbmRleDogaSxcclxuICAgICAgICBwYXRoOiB0aGlzLm9iamVjdFBhdGhcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcblxyXG5pbXBvcnQgeyBEaWZmZXJlbnRpYXRlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2RpZmZlcmVudGlhdGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGlmZmVyZW50aWF0ZVRyZWUgfSBmcm9tICcuL2NvbXBvbmVudHMvZGlmZmVyZW50aWF0ZS10cmVlLmNvbXBvbmVudCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBEaWZmZXJlbnRpYXRlQ29tcG9uZW50LFxyXG4gICAgRGlmZmVyZW50aWF0ZVRyZWVcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIERpZmZlcmVudGlhdGVDb21wb25lbnRcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgXSxcclxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBEaWZmZXJlbnRpYXRlTW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFFRSxVQUFXO0lBQ1gsT0FBUTtJQUNSLE9BQVE7SUFDUixRQUFTOzs0Q0FIVCxPQUFPOzRDQUNQLElBQUk7NENBQ0osSUFBSTs0Q0FDSixLQUFLOzs7SUFHTCxVQUFXO0lBQ1gsY0FBZTtJQUNmLGNBQWU7SUFDZixlQUFnQjtJQUNoQixRQUFTO0lBQ1QsVUFBVzs7Z0RBTFgsT0FBTztnREFDUCxXQUFXO2dEQUNYLFdBQVc7Z0RBQ1gsWUFBWTtnREFDWixLQUFLO2dEQUNMLE9BQU87Ozs7OztBQ1RUO0lBd0VFOzJCQTNDYyxLQUFLOzRCQUdKLEtBQUs7eUNBR1EsSUFBSTttQ0FHVixLQUFLOytCQVNULGdCQUFnQjtnQ0FHZixpQkFBaUI7d0JBY3pCLElBQUksWUFBWSxFQUFFO3lCQUdqQixJQUFJLFlBQVksRUFBRTs0QkFHZixJQUFJLFlBQVksRUFBRTtLQUloQzs7Ozs7SUF0QkQsSUFDSSxlQUFlLENBQUMsS0FBYTs7UUFDL0IsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ1osSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3RDO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztTQUMvQjtLQUNGOzs7O0lBY08sY0FBYzs7UUFDcEIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDOztRQUNkLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQTtRQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7Ozs7Ozs7SUFFbkQsZ0NBQWdDLENBQUMsSUFBSSxFQUFFLE1BQU07O1FBQ25ELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQzs7UUFDZCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFZixJQUFJLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBdUI7WUFDaEMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLHVCQUF1QixDQUFDLE9BQU8sRUFBRTtnQkFDbkQsSUFBSSxNQUFNLEtBQUsscUJBQXFCLENBQUMsSUFBSSxFQUFFO29CQUN6QyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUsscUJBQXFCLENBQUMsT0FBTyxFQUFFO3dCQUMvQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDeEI7eUJBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUFDLElBQUksRUFBRTt3QkFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO3FCQUM5Qjt5QkFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUsscUJBQXFCLENBQUMsS0FBSyxFQUFFOzt3QkFDcEQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUM1RSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFOzRCQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDckI7NkJBQU07NEJBQ0wsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ1o7cUJBQ0Y7eUJBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUFDLElBQUksRUFBRTt3QkFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ3JGO2lCQUNGO3FCQUFNLElBQUksTUFBTSxLQUFLLHFCQUFxQixDQUFDLEtBQUssRUFBQztvQkFDaEQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUFDLE9BQU8sRUFBRTt3QkFDL0MsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ3hCO3lCQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUU7d0JBQ25ELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztxQkFDdEU7eUJBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUFDLEtBQUssRUFBRTt3QkFDcEQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztxQkFDL0U7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7Ozs7SUFFN0IsZ0NBQWdDLENBQUMsSUFBSTs7UUFDM0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksSUFBSSxZQUFZLEtBQUssRUFBRTs7WUFDekIsTUFBTSxRQUFRLEdBQXdCLEVBQUUsQ0FBQzs7WUFDekMsTUFBTSxDQUFDLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Z0JBQ2hCLE1BQU0sU0FBUyxHQUFRLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkUsSUFBSSxTQUFTLFlBQVksS0FBSyxFQUFFO29CQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFO3dCQUNuQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTSxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUEsRUFBQyxDQUFDLENBQUM7d0JBQzNELFNBQVMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFvQixFQUFFLENBQUM7NEJBQ3JDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDOzRCQUNaLENBQUMsQ0FBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt5QkFDcEIsQ0FBQyxDQUFDO3FCQUNKO29CQUNELFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBQ1osRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUU7d0JBQ3pCLEtBQUssRUFBRSxDQUFDO3dCQUNSLElBQUksRUFBRSxFQUFFO3dCQUNSLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQzt3QkFDZixLQUFLLEVBQUUsRUFBRTt3QkFDVCxNQUFNLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLEVBQUUscUJBQXFCLENBQUMsS0FBSzt3QkFDakMsTUFBTSxFQUFFLHVCQUF1QixDQUFDLE9BQU87d0JBQ3ZDLFFBQVEsRUFBRSxTQUFTO3FCQUNwQixDQUFDLENBQUM7aUJBQ0o7cUJBQU07b0JBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDWixFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRTt3QkFDekIsS0FBSyxFQUFFLENBQUM7d0JBQ1IsSUFBSSxFQUFFLEVBQUU7d0JBQ1IsT0FBTyxFQUFFLEVBQUUsR0FBRyxDQUFDO3dCQUNmLEtBQUssRUFBRSxTQUFTO3dCQUNoQixNQUFNLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLEVBQUUscUJBQXFCLENBQUMsT0FBTzt3QkFDbkMsTUFBTSxFQUFFLHVCQUF1QixDQUFDLE9BQU87d0JBQ3ZDLFFBQVEsRUFBRSxFQUFFO3FCQUNiLENBQUMsQ0FBQztpQkFDSjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sR0FBRyxRQUFRLENBQUM7U0FDbkI7YUFBTSxJQUFJLElBQUksWUFBWSxNQUFNLEVBQUU7O1lBQ2pDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O1lBQy9CLE1BQU0sUUFBUSxHQUF3QixFQUFFLENBQUM7O1lBQ3pDLE1BQU0sQ0FBQyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQztZQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFO2dCQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFBLEVBQUMsQ0FBQyxDQUFDO2FBQzdDO1lBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUksRUFBRSxDQUFDOztnQkFDaEIsTUFBTSxTQUFTLEdBQVEsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLFNBQVMsWUFBWSxLQUFLLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUU7d0JBQ25DLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFNLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQSxFQUFDLENBQUMsQ0FBQzt3QkFDM0QsU0FBUyxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQW9CLEVBQUUsQ0FBQzs0QkFDckMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7NEJBQ1osQ0FBQyxDQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUNwQixDQUFDLENBQUM7cUJBQ0o7b0JBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDWixFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRTt3QkFDekIsS0FBSyxFQUFFLENBQUM7d0JBQ1IsSUFBSSxFQUFFLElBQUk7d0JBQ1YsT0FBTyxFQUFFLEVBQUUsR0FBRyxDQUFDO3dCQUNmLEtBQUssRUFBRSxFQUFFO3dCQUNULE1BQU0sRUFBRSxDQUFDO3dCQUNULElBQUksRUFBRSxxQkFBcUIsQ0FBQyxJQUFJO3dCQUNoQyxNQUFNLEVBQUUsdUJBQXVCLENBQUMsT0FBTzt3QkFDdkMsUUFBUSxFQUFFLFNBQVM7cUJBQ3BCLENBQUMsQ0FBQztpQkFDSjtxQkFBTTtvQkFDTCxRQUFRLENBQUMsSUFBSSxDQUFDO3dCQUNaLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFO3dCQUN6QixLQUFLLEVBQUUsQ0FBQzt3QkFDUixJQUFJLEVBQUUsSUFBSTt3QkFDVixPQUFPLEVBQUUsRUFBRSxHQUFHLENBQUM7d0JBQ2YsS0FBSyxFQUFFLFNBQVM7d0JBQ2hCLE1BQU0sRUFBRSxDQUFDO3dCQUNULElBQUksRUFBRSxxQkFBcUIsQ0FBQyxJQUFJO3dCQUNoQyxNQUFNLEVBQUUsdUJBQXVCLENBQUMsT0FBTzt3QkFDdkMsUUFBUSxFQUFFLEVBQUU7cUJBQ2IsQ0FBQyxDQUFDO2lCQUNKO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxHQUFHLFFBQVEsQ0FBQztTQUNuQjtRQUNELE9BQU8sTUFBTSxDQUFDOzs7Ozs7O0lBR1IsV0FBVyxDQUFDLElBQXlCLEVBQUUsSUFBdUI7O1FBQ3BFLElBQUksTUFBTSxDQUFvQjs7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxxQkFBcUIsQ0FBQyxPQUFPO2FBQzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1lBQ25ELElBQUksQ0FBQyxJQUFJLEtBQUsscUJBQXFCLENBQUMsS0FBSztnQkFDekMsSUFBSSxDQUFDLE9BQU87Z0JBQ1osSUFBSSxDQUFDLElBQUksQ0FBQztRQUV0QixJQUFJLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBdUI7WUFDaEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUFDLE9BQU8sRUFBRTtnQkFDL0MsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxFQUFFO29CQUMxRCxNQUFNLEdBQUcsSUFBSSxDQUFDO2lCQUNmO2FBQ0Y7aUJBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUFDLEtBQUssRUFBRTtnQkFDcEQsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEdBQUcsRUFBRTtvQkFDeEIsTUFBTSxHQUFHLElBQUksQ0FBQztpQkFDZjthQUNGO2lCQUFNO2dCQUNMLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUU7b0JBQ3JCLE1BQU0sR0FBRyxJQUFJLENBQUM7aUJBQ2Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDOzs7Ozs7O0lBR1IscUJBQXFCLENBQUMsUUFBMkIsRUFBRSxTQUE0Qjs7UUFDckYsSUFBSSxNQUFNLENBQW9CO1FBQzlCLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDM0IsT0FBTyxNQUFNLENBQUM7U0FDZjs7UUFDRCxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUFDLE9BQU87YUFDM0MsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7WUFDckQsU0FBUyxDQUFDLElBQUksS0FBSyxxQkFBcUIsQ0FBQyxLQUFLO2dCQUM5QyxTQUFTLENBQUMsT0FBTztnQkFDakIsU0FBUyxDQUFDLElBQUksQ0FBQztRQUUvQixJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUsscUJBQXFCLENBQUMsT0FBTyxFQUFFO1lBQ25ELElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLEdBQUcsRUFBRTtnQkFDbEUsTUFBTSxHQUFHLFFBQVEsQ0FBQzthQUNuQjtTQUNGO2FBQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUFDLEtBQUssRUFBRTtZQUN4RCxJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUssR0FBRyxFQUFFO2dCQUM1QixNQUFNLEdBQUcsUUFBUSxDQUFDO2FBQ25CO1NBQ0Y7YUFBTTtZQUNMLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUU7Z0JBQ3pCLE1BQU0sR0FBRyxRQUFRLENBQUM7YUFDbkI7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDOzs7Ozs7O0lBR1IsT0FBTyxDQUFDLFFBQTJCLEVBQUUsU0FBNEI7UUFDdkUsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxJQUFJLEVBQUU7WUFDcEMsUUFBUSxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxXQUFXLENBQUM7WUFDdEQsU0FBUyxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxXQUFXLENBQUM7WUFDdkQsUUFBUSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQ3BDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztTQUNyQzthQUFNLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUU7WUFDMUQsSUFBSSxRQUFRLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3RDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDO2dCQUN2RCxTQUFTLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLFlBQVksQ0FBQztnQkFDeEQsUUFBUSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUNwQyxTQUFTLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7YUFDckM7U0FDRjthQUFNLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUU7WUFDdkQsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3BDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsV0FBVyxDQUFDO2dCQUN0RCxTQUFTLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLFdBQVcsQ0FBQztnQkFDdkQsUUFBUSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUNwQyxTQUFTLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7YUFDckM7WUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDdEMsUUFBUSxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZELFNBQVMsQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDO2dCQUN4RCxRQUFRLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3BDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQzthQUNyQztTQUNGO2FBQU07WUFDTCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLElBQUksRUFBRTtnQkFDcEMsUUFBUSxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxXQUFXLENBQUM7Z0JBQ3RELFNBQVMsQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsV0FBVyxDQUFDO2dCQUN2RCxRQUFRLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3BDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQzthQUNyQztZQUNELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbkQ7Ozs7OztJQUVLLE9BQU8sQ0FBQyxJQUF5QjtRQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzdCLENBQUMsQ0FBQzs7Ozs7Ozs7O0lBRUcsUUFBUSxDQUNKLElBQXlCLEVBQ3pCLElBQXVCLEVBQ3ZCLEtBQWEsRUFDYixNQUErQjtRQUV6QyxJQUFJLElBQUksRUFBRTs7WUFDUixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDOUIsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQzdDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQ2pEOzs7Ozs7O0lBRUssaUJBQWlCLENBQUMsSUFBSSxFQUFFLE1BQU07UUFDcEMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQUM7WUFDVixDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNsQixJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQTtTQUMzQyxDQUFDLENBQUM7Ozs7Ozs7SUFFRyxLQUFLLENBQUMsUUFBNkIsRUFBRSxTQUE4Qjs7UUFDekUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUF3Qjs7UUFBakMsSUFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFpQjs7UUFBakMsSUFBa0IsT0FBTyxHQUFHLElBQUksQ0FBQztRQUVqQyxPQUFPLE9BQU8sRUFBRTs7WUFDZCxJQUFJLG1CQUFtQixHQUFzQixDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7O1lBQ3hILElBQUksbUJBQW1CLEdBQXNCLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUV6SCxJQUFJLENBQUMsbUJBQW1CLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO29CQUNyQixPQUFPLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFO3dCQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUMxRSxDQUFDLEVBQUUsQ0FBQzt3QkFBQSxDQUFDLEVBQUUsQ0FBQztxQkFDVDtpQkFDRjtxQkFBTTtvQkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUMxRSxDQUFDLEVBQUUsQ0FBQztvQkFBQSxDQUFDLEVBQUUsQ0FBQztpQkFDVDthQUNGO1lBQ0QsSUFBSSxDQUFDLG1CQUFtQixJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDcEIsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRTt3QkFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDeEUsQ0FBQyxFQUFFLENBQUM7d0JBQUEsQ0FBQyxFQUFFLENBQUM7cUJBQ1Q7aUJBQ0Y7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDeEUsQ0FBQyxFQUFFLENBQUM7b0JBQUEsQ0FBQyxFQUFFLENBQUM7aUJBQ1Q7YUFDRjtZQUNELElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDeEIsbUJBQW1CLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQzthQUN2RTtZQUNELElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDeEIsbUJBQW1CLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQzthQUNyRTtZQUNELElBQUksbUJBQW1CLElBQUksbUJBQW1CLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDMUQsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDMUIsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUUsSUFBSSxtQkFBbUIsRUFBRTt3QkFDdkIsbUJBQW1CLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQzt3QkFDdEUsTUFBTTtxQkFDUDt5QkFBTTt3QkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUMxRSxDQUFDLEVBQUUsQ0FBQzt3QkFBQSxDQUFDLEVBQUUsQ0FBQztxQkFDVDtpQkFDRjthQUNGO1lBQ0QsSUFBSSxtQkFBbUIsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO2dCQUMxRCxPQUFPLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFO29CQUMzQixtQkFBbUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1RSxJQUFJLG1CQUFtQixFQUFFO3dCQUN2QixtQkFBbUIsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO3dCQUNwRSxNQUFNO3FCQUNQO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3hFLENBQUMsRUFBRSxDQUFDO3dCQUFBLENBQUMsRUFBRSxDQUFDO3FCQUNUO2lCQUNGO2FBQ0Y7WUFDRCxJQUFJLG1CQUFtQixJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFOztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssbUJBQW1CLENBQUMsS0FBSyxFQUFFO29CQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN4RSxDQUFDLEVBQUUsQ0FBQztvQkFBQSxDQUFDLEVBQUUsQ0FBQztvQkFDUixtQkFBbUIsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO2lCQUN2RTthQUNGO1lBQ0QsSUFBSSxtQkFBbUIsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRTs7Z0JBQy9DLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLG1CQUFtQixDQUFDLEtBQUssRUFBRTtvQkFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDMUUsQ0FBQyxFQUFFLENBQUM7b0JBQUEsQ0FBQyxFQUFFLENBQUM7b0JBQ1IsbUJBQW1CLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztpQkFDckU7YUFDRjtZQUNELElBQUksbUJBQW1CLElBQUksbUJBQW1CLEVBQUU7Z0JBQzlDLElBQUksbUJBQW1CLENBQUMsTUFBTSxLQUFLLG1CQUFtQixDQUFDLE1BQU0sRUFBRTtvQkFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDeEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDM0U7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2lCQUN4RDtnQkFDRCxDQUFDLEVBQUUsQ0FBQztnQkFBQSxDQUFDLEVBQUUsQ0FBQzthQUNUO1lBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDekQ7Ozs7Ozs7SUFFSyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsU0FBUzs7UUFDN0MsTUFBTSxNQUFNLEdBQUc7WUFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLFFBQVEsQ0FBQztZQUN6RCxTQUFTLEVBQUUsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLFNBQVMsQ0FBQztTQUM1RCxDQUFDO1FBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU5QyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDM0Q7UUFFRCxPQUFPLE1BQU0sQ0FBQzs7Ozs7O0lBRVIsZUFBZSxDQUFDLElBQXlCOztRQUMvQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFbEIsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUk7WUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU07Z0JBQy9ELElBQUksQ0FBQyxNQUFNLEtBQUssdUJBQXVCLENBQUMsT0FBTyxFQUFFO2dCQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBRSxDQUFDLENBQW9CLEVBQUUsQ0FBQztZQUNsQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNwQixDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sQ0FBQzs7Ozs7O0lBR2hCLFdBQVcsQ0FBQyxPQUFPO1FBQ2pCLElBQUksT0FBTyxDQUFDLHlCQUF5QjtZQUNuQyxPQUFPLENBQUMsbUJBQW1CO1lBQzNCLE9BQU8sQ0FBQyxjQUFjO1lBQ3RCLE9BQU8sQ0FBQyxlQUFlO1lBQ3ZCLE9BQU8sQ0FBQyxlQUFlLEVBQUU7WUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO0tBQ0Y7Ozs7SUFFRCxRQUFRO1FBQ04sVUFBVSxDQUFDLE1BQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pDOzs7OztJQUNPLGVBQWUsQ0FBQyxJQUFJOztRQUMxQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVE7WUFDN0IsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDMUIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDbkI7U0FDRixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQzs7Ozs7O0lBRU4sbUJBQW1CLENBQUMsSUFBSTtRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSTs7WUFDYixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLOztnQkFDdEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekMsSUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO29CQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNsQjthQUNGLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDdkIsQ0FBQyxDQUFDOzs7OztJQUVHLElBQUk7UUFDVixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTs7WUFDL0MsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxZQUFZLEtBQUssSUFBSyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBOztZQUNsRyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLFlBQVksS0FBSyxJQUFLLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7O1lBQ3RHLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUQsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNyQixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ2pEO1lBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDO29CQUNmLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN6QixJQUFJLEVBQUUsRUFBRTtvQkFDUixLQUFLLEVBQUUsTUFBTTtvQkFDYixLQUFLLEVBQUUsQ0FBQztvQkFDUixNQUFNLEVBQUUscUJBQXFCLENBQUMsS0FBSztvQkFDbkMsSUFBSSxFQUFFLHFCQUFxQixDQUFDLEtBQUs7b0JBQ2pDLFFBQVEsRUFBRSxJQUFJO29CQUNkLE1BQU0sRUFBRSxJQUFJO29CQUNaLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUTtpQkFDL0IsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRSxDQUFDO29CQUNmLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN6QixJQUFJLEVBQUUsRUFBRTtvQkFDUixLQUFLLEVBQUUsTUFBTTtvQkFDYixLQUFLLEVBQUUsQ0FBQztvQkFDUixNQUFNLEVBQUUscUJBQXFCLENBQUMsS0FBSztvQkFDbkMsSUFBSSxFQUFFLHFCQUFxQixDQUFDLEtBQUs7b0JBQ2pDLFFBQVEsRUFBRSxJQUFJO29CQUNkLE1BQU0sRUFBRSxJQUFJO29CQUNaLFFBQVEsRUFBRSxXQUFXLENBQUMsU0FBUztpQkFDaEMsQ0FBQyxDQUFDO1lBQ0gsVUFBVSxDQUFDO2dCQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUM1QixFQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ1I7Ozs7O0lBRUssbUJBQW1COztRQUN6QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUUsQ0FBQyxRQUFRO1lBQ3RDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSTtnQkFDMUIsSUFBRyxJQUFJLENBQUMsTUFBTSxLQUFLLHVCQUF1QixDQUFDLE9BQU8sRUFBRTtvQkFDbEQsS0FBSyxFQUFFLENBQUM7aUJBQ1Q7YUFDRixDQUFDLENBQUM7U0FDSixDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Ozs7Ozs7SUFFeEIsYUFBYSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRTs7UUFDMUMsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzFCLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbEIsU0FBUyxHQUFHLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUM7U0FDaEQ7YUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSTtnQkFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDZCxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTt3QkFDL0MsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7cUJBQ3pCO3lCQUFNLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7d0JBQ3pCLFNBQVMsR0FBRyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO3FCQUN4QztpQkFDRjthQUNGLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxTQUFTLENBQUM7Ozs7Ozs7OztJQUVYLHFCQUFxQixDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7O1FBQ2xFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQy9ELElBQUksTUFBTSxLQUFLLHVCQUF1QixDQUFDLE9BQU8sRUFBRTtZQUM5QyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7WUFDM0QsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDO1lBQzVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQy9FO2FBQU0sSUFBSSxNQUFNLEtBQUssdUJBQXVCLENBQUMsS0FBSyxFQUFFO1lBQ25ELFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoRSxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM3QzthQUFNLElBQUksTUFBTSxLQUFLLHVCQUF1QixDQUFDLFdBQVcsRUFBRTtZQUN6RCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNqRCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7WUFDM0QsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDO1lBQzVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQy9FO2FBQU0sSUFBSSxNQUFNLEtBQUssdUJBQXVCLENBQUMsWUFBWSxFQUFFO1lBQzFELGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ25ELGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztZQUM1RCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7WUFDM0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDL0U7YUFBTSxJQUFJLE1BQU0sS0FBSyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUU7WUFDekQsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDakQsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDO1lBQzNELGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztZQUM1RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1RSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUMxRDtRQUNELFVBQVUsQ0FBQztZQUNULElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNsQixLQUFLLEVBQUUsQ0FBQztnQkFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLElBQUksQ0FBQzthQUMxRixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztTQUM1QixFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7Ozs7SUFFRCxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDOztRQUNqRSxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUNoRSxJQUFJLE1BQU0sS0FBSyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUU7WUFDNUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDO1lBQzNELGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztZQUM1RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUMvRTthQUFNLElBQUksTUFBTSxLQUFLLHVCQUF1QixDQUFDLE9BQU8sRUFBRTtZQUNyRCxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEUsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDN0M7YUFBTSxJQUFJLE1BQU0sS0FBSyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUU7WUFDekQsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDakQsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDO1lBQzVELFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztZQUMzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUMvRTthQUFNLElBQUksTUFBTSxLQUFLLHVCQUF1QixDQUFDLFlBQVksRUFBRTtZQUMxRCxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNuRCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7WUFDM0QsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDO1lBQzVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQy9FO2FBQU0sSUFBSSxNQUFNLEtBQUssdUJBQXVCLENBQUMsV0FBVyxFQUFFO1lBQ3pELGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2pELGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztZQUM1RCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7WUFDM0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUUsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDMUQ7UUFDRCxVQUFVLENBQUM7WUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDakIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsSUFBSSxFQUFFLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7YUFDMUYsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7U0FDNUIsRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7O0lBRVQsT0FBTyxDQUFDLEtBQUs7O1FBQ1gsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRELElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxDQUFDLG9CQUFvQixDQUN2QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFDckYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQ2hHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzdCO2FBQU07WUFDTCxJQUFJLENBQUMscUJBQXFCLENBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUM5RixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFDdkYsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDN0I7S0FDRjs7Ozs7SUFDRCxVQUFVLENBQUMsS0FBSzs7UUFDZCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztRQUM1QyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7UUFDN0MsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFNUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7UUFDN0IsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7S0FDOUI7Ozs7O0lBQ0QsT0FBTyxDQUFDLEtBQUs7O1FBQ1gsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0tBQzVFOzs7WUF4bkJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsZ3REQUE2Qzs7YUFFOUM7Ozs7OzBCQVFFLEtBQUssU0FBQyxhQUFhOzJCQUduQixLQUFLLFNBQUMsY0FBYzt3Q0FHcEIsS0FBSyxTQUFDLDJCQUEyQjtrQ0FHakMsS0FBSyxTQUFDLHFCQUFxQjs2QkFHM0IsS0FBSyxTQUFDLGdCQUFnQjs4QkFHdEIsS0FBSyxTQUFDLGlCQUFpQjs4QkFHdkIsS0FBSyxTQUFDLGlCQUFpQjsrQkFHdkIsS0FBSyxTQUFDLGtCQUFrQjs4QkFHeEIsS0FBSyxTQUFDLGlCQUFpQjt1QkFXdkIsTUFBTSxTQUFDLFVBQVU7d0JBR2pCLE1BQU0sU0FBQyxXQUFXOzJCQUdsQixNQUFNLFNBQUMsY0FBYzs7Ozs7OztBQ3BFeEI7O3lCQW1CYyxJQUFJO29DQU1PLEtBQUs7cUNBR0osS0FBSztzQkFHcEIsQ0FBQztvQkFHSCxFQUFFO3FCQUdELEdBQUc7MEJBR0UsRUFBRTsrQkFNRyxnQkFBZ0I7Z0NBR2YsaUJBQWlCO3VCQUcxQixJQUFJLFlBQVksRUFBRTt3QkFHakIsSUFBSSxZQUFZLEVBQUU7d0JBR2xCLElBQUksWUFBWSxFQUFFOzs7OztJQUU3QixRQUFRO1FBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25DOzs7OztJQUVELE9BQU8sQ0FBQyxLQUFLO1FBQ1gsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFCOzs7OztJQUVELEtBQUssQ0FBQyxLQUFLOztRQUNULE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxJQUFJLEtBQUssRUFBRSxFQUFFO1lBQ2YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN4QjtLQUNBOzs7O0lBRUQsWUFBWTs7UUFDVixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUk7WUFDdEIsSUFBRyxJQUFJLENBQUMsTUFBTSxLQUFLLHVCQUF1QixDQUFDLE9BQU8sRUFBRTtnQkFDbEQsS0FBSyxFQUFFLENBQUM7YUFDVDtTQUNGLENBQUMsQ0FBQTtRQUNGLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7O0lBRUQsTUFBTSxDQUFDLEtBQUs7UUFDVixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsVUFBVSxDQUFFLENBQUM7S0FDdkM7Ozs7O0lBQ0QsVUFBVSxDQUFDLEtBQUs7UUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQjs7Ozs7SUFDRCxrQkFBa0IsQ0FBQyxLQUFLO1FBQ3RCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMvRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7S0FDbkQ7Ozs7O0lBQ0QsaUJBQWlCLENBQUMsS0FBSztRQUNyQixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDL0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0tBQ2xEOzs7OztJQUNELE9BQU8sQ0FBQyxLQUFLOztRQUVYLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCOzs7Ozs7O0lBRUQsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFdkIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNwQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLEtBQUssRUFBRSxJQUFJO2dCQUNYLEtBQUssRUFBRSxDQUFDO2dCQUNSLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVTthQUN0QixDQUFDLENBQUM7U0FDSjtLQUNGOzs7WUEzR0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLHl6R0FBa0Q7O2FBRW5EOzs7d0JBSUUsS0FBSyxTQUFDLFdBQVc7dUJBR2pCLEtBQUssU0FBQyxVQUFVO21DQUdoQixLQUFLLFNBQUMsc0JBQXNCO29DQUc1QixLQUFLLFNBQUMsdUJBQXVCO3FCQUc3QixLQUFLLFNBQUMsUUFBUTttQkFHZCxLQUFLLFNBQUMsTUFBTTtvQkFHWixLQUFLLFNBQUMsT0FBTzt5QkFHYixLQUFLLFNBQUMsWUFBWTsyQkFHbEIsS0FBSyxTQUFDLGNBQWM7OEJBR3BCLEtBQUssU0FBQyxpQkFBaUI7K0JBR3ZCLEtBQUssU0FBQyxrQkFBa0I7c0JBR3hCLE1BQU0sU0FBQyxTQUFTO3VCQUdoQixNQUFNLFNBQUMsVUFBVTt1QkFHakIsTUFBTSxTQUFDLFVBQVU7Ozs7Ozs7QUM5RHBCOzs7WUFNQyxRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFlBQVk7aUJBQ2I7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLHNCQUFzQjtvQkFDdEIsaUJBQWlCO2lCQUNsQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1Asc0JBQXNCO2lCQUN2QjtnQkFDRCxlQUFlLEVBQUUsRUFDaEI7Z0JBQ0QsU0FBUyxFQUFFLEVBQ1Y7Z0JBQ0QsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7YUFDbEM7Ozs7Ozs7Ozs7Ozs7OzsifQ==