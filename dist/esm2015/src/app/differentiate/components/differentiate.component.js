/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DifferentiateNodeType, DifferentiateNodeStatus } from '../interfaces/differentiate.interfaces';
export class DifferentiateComponent {
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
if (false) {
    /** @type {?} */
    DifferentiateComponent.prototype.leftSide;
    /** @type {?} */
    DifferentiateComponent.prototype.rightSide;
    /** @type {?} */
    DifferentiateComponent.prototype.ready;
    /** @type {?} */
    DifferentiateComponent.prototype.categorizeBy;
    /** @type {?} */
    DifferentiateComponent.prototype.allowRevert;
    /** @type {?} */
    DifferentiateComponent.prototype.allowAdvance;
    /** @type {?} */
    DifferentiateComponent.prototype.attributeOrderIsImportant;
    /** @type {?} */
    DifferentiateComponent.prototype.onlyShowDifferences;
    /** @type {?} */
    DifferentiateComponent.prototype.leftSideObject;
    /** @type {?} */
    DifferentiateComponent.prototype.rightSideObject;
    /** @type {?} */
    DifferentiateComponent.prototype.leftSideToolTip;
    /** @type {?} */
    DifferentiateComponent.prototype.rightSideToolTip;
    /** @type {?} */
    DifferentiateComponent.prototype.onrevert;
    /** @type {?} */
    DifferentiateComponent.prototype.onadvance;
    /** @type {?} */
    DifferentiateComponent.prototype.ondifference;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9kaWZmZXJlbnRpYXRlLyIsInNvdXJjZXMiOlsic3JjL2FwcC9kaWZmZXJlbnRpYXRlL2NvbXBvbmVudHMvZGlmZmVyZW50aWF0ZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUVMLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDeEIsTUFBTSx3Q0FBd0MsQ0FBQztBQVFoRCxNQUFNO0lBbURKOzJCQTNDYyxLQUFLOzRCQUdKLEtBQUs7eUNBR1EsSUFBSTttQ0FHVixLQUFLOytCQVNULGdCQUFnQjtnQ0FHZixpQkFBaUI7d0JBY3pCLElBQUksWUFBWSxFQUFFO3lCQUdqQixJQUFJLFlBQVksRUFBRTs0QkFHZixJQUFJLFlBQVksRUFBRTtLQUloQzs7Ozs7SUF0QkQsSUFDSSxlQUFlLENBQUMsS0FBYTs7UUFDL0IsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdEM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1NBQy9CO0tBQ0Y7Ozs7SUFjTyxjQUFjOztRQUNwQixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7O1FBQ2QsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFBO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcs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QUFLLFNBQUMsYUFBYTsyQkFHbkIsS0FBSyxTQUFDLGNBQWM7d0NBR3BCLEtBQUssU0FBQywyQkFBMkI7a0NBR2pDLEtBQUssU0FBQyxxQkFBcUI7NkJBRzNCLEtBQUssU0FBQyxnQkFBZ0I7OEJBR3RCLEtBQUssU0FBQyxpQkFBaUI7OEJBR3ZCLEtBQUssU0FBQyxpQkFBaUI7K0JBR3ZCLEtBQUssU0FBQyxrQkFBa0I7OEJBR3hCLEtBQUssU0FBQyxpQkFBaUI7dUJBV3ZCLE1BQU0sU0FBQyxVQUFVO3dCQUdqQixNQUFNLFNBQUMsV0FBVzsyQkFHbEIsTUFBTSxTQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDb21wYXJpc2lvbiBUb29sIHdpbGwgbGF5b3V0IHR3byBjb21wYXJpc2lvbiB0cmVlcyBzaWRlIGJ5IHNpZGUgYW5kIGZlZWQgdGhlbSBhbiBpbnRlcm5hbCBvYmplY3RcclxuICogaGVpcmFyY2h5IGNyZWF0ZWQgZm9yIGludGVybmFsIHVzZSBmcm9tIEpTT04gb2JqZWN0cyBnaXZlbiB0byB0aGlzIGNvbXBvbmVudC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEaWZmZXJlbnRpYXRlTm9kZSxcclxuICBEaWZmZXJlbnRpYXRlTm9kZVR5cGUsXHJcbiAgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXNcclxufSBmcm9tICcuLi9pbnRlcmZhY2VzL2RpZmZlcmVudGlhdGUuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFRocm93U3RtdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZGlmZmVyZW50aWF0ZScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RpZmZlcmVudGlhdGUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2RpZmZlcmVudGlhdGUuY29tcG9uZW50LnNjc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIERpZmZlcmVudGlhdGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcbiAgXHJcbiAgbGVmdFNpZGU7XHJcbiAgcmlnaHRTaWRlO1xyXG4gIHJlYWR5OiBib29sZWFuO1xyXG4gIGNhdGVnb3JpemVCeTogc3RyaW5nW107XHJcblxyXG4gIEBJbnB1dChcImFsbG93UmV2ZXJ0XCIpXHJcbiAgYWxsb3dSZXZlcnQgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KFwiYWxsb3dBZHZhbmNlXCIpXHJcbiAgYWxsb3dBZHZhbmNlID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcImF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnRcIilcclxuICBhdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50ID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KFwib25seVNob3dEaWZmZXJlbmNlc1wiKVxyXG4gIG9ubHlTaG93RGlmZmVyZW5jZXMgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KFwibGVmdFNpZGVPYmplY3RcIilcclxuICBsZWZ0U2lkZU9iamVjdFxyXG5cclxuICBASW5wdXQoXCJyaWdodFNpZGVPYmplY3RcIilcclxuICByaWdodFNpZGVPYmplY3Q7XHJcblxyXG4gIEBJbnB1dChcImxlZnRTaWRlVG9vbFRpcFwiKVxyXG4gIGxlZnRTaWRlVG9vbFRpcCA9IFwidGFrZSBsZWZ0IHNpZGVcIjtcclxuXHJcbiAgQElucHV0KFwicmlnaHRTaWRlVG9vbFRpcFwiKVxyXG4gIHJpZ2h0U2lkZVRvb2xUaXAgPSBcInRha2UgcmlnaHQgc2lkZVwiO1xyXG5cclxuICBASW5wdXQoJ25hbWVkUm9vdE9iamVjdCcpXHJcbiAgc2V0IG5hbWVkUm9vdE9iamVjdCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgeCA9IHZhbHVlLnJlcGxhY2UoXCIgXCIsIFwiXCIpO1xyXG5cclxuICAgIGlmICh4Lmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmNhdGVnb3JpemVCeSA9IHZhbHVlLnNwbGl0KFwiLFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcml6ZUJ5ID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQE91dHB1dChcIm9ucmV2ZXJ0XCIpXHJcbiAgb25yZXZlcnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmFkdmFuY2VcIilcclxuICBvbmFkdmFuY2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmRpZmZlcmVuY2VcIilcclxuICBvbmRpZmZlcmVuY2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFx0KSB7XHJcblx0ICBcclxuICB9XHJcbiAgcHJpdmF0ZSBnZW5lcmF0ZU5vZGVJZCgpIHtcclxuICAgIGNvbnN0IG1pbiA9IDE7XHJcbiAgICBjb25zdCBtYXggPSAxMDAwMFxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgfVxyXG4gIHByaXZhdGUgdHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUobm9kZSwgcGFyZW50KSB7XHJcbiAgICBsZXQganNvbiA9IHt9O1xyXG4gICAgbGV0IGFycmF5ID0gW107XHJcblxyXG4gICAgbm9kZS5tYXAoIChpdGVtOiBEaWZmZXJlbnRpYXRlTm9kZSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5zdGF0dXMgIT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpIHtcclxuICAgICAgICBpZiAocGFyZW50ID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbikgeyAgICBcclxuICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLnBhaXIpIHtcclxuICAgICAgICAgICAganNvbltpdGVtLm5hbWVdID0gaXRlbS52YWx1ZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpIHtcclxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUoaXRlbS5jaGlsZHJlbiwgaXRlbS5wYXJlbnQpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGpzb25baXRlbS5uYW1lXSA9IHg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAganNvbiA9IFt4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKSB7XHJcbiAgICAgICAgICAgIGpzb25baXRlbS5uYW1lXSA9IHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUoaXRlbS5jaGlsZHJlbiwgaXRlbS5wYXJlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAocGFyZW50ID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpe1xyXG4gICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbikge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUoaXRlbSwgaXRlbS5wYXJlbnQpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaCh0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKGl0ZW0uY2hpbGRyZW4sIGl0ZW0ucGFyZW50KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBhcnJheS5sZW5ndGggPyBhcnJheSA6IGpzb247XHJcbiAgfVxyXG4gIHByaXZhdGUgdHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24obm9kZSkge1xyXG4gICAgbGV0IHJlc3VsdCA9IG5vZGU7XHJcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuOiBEaWZmZXJlbnRpYXRlTm9kZVtdID0gW107XHJcbiAgICAgIGNvbnN0IHAgPSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXk7XHJcbiAgICAgIG5vZGUubWFwKCAoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGpzb25WYWx1ZTogYW55ID0gdGhpcy50cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihpdGVtKTtcclxuICAgICAgICBpZiAoanNvblZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5hdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50KSB7XHJcbiAgICAgICAgICAgIGpzb25WYWx1ZS5zb3J0KChhLGIpID0+IHtyZXR1cm4gYS5uYW1lIDw9IGIubmFtZSA/IC0xOiAxfSk7XHJcbiAgICAgICAgICAgIGpzb25WYWx1ZS5tYXAoICh4OiBEaWZmZXJlbnRpYXRlTm9kZSwgaSkgPT57XHJcbiAgICAgICAgICAgICAgeC5pbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgeC5hbHROYW1lID0gXCJcIiArIGk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICBhbHROYW1lOiBcIlwiICsgaSxcclxuICAgICAgICAgICAgdmFsdWU6IFwiXCIsXHJcbiAgICAgICAgICAgIHBhcmVudDogcCxcclxuICAgICAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5LFxyXG4gICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBqc29uVmFsdWVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIG5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgIGFsdE5hbWU6IFwiXCIgKyBpLFxyXG4gICAgICAgICAgICB2YWx1ZToganNvblZhbHVlLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHAsXHJcbiAgICAgICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsLFxyXG4gICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSAgICAgIFxyXG4gICAgICB9KTtcclxuICAgICAgcmVzdWx0ID0gY2hpbGRyZW47XHJcbiAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgY29uc3QgbGlzdCA9IE9iamVjdC5rZXlzKG5vZGUpO1xyXG4gICAgICBjb25zdCBjaGlsZHJlbjogRGlmZmVyZW50aWF0ZU5vZGVbXSA9IFtdO1xyXG4gICAgICBjb25zdCBwID0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb247XHJcbiAgICAgIGlmICghdGhpcy5hdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50KSB7XHJcbiAgICAgICAgbGlzdC5zb3J0KChhLGIpID0+IHtyZXR1cm4gYSA8PSBiID8gLTE6IDF9KTtcclxuICAgICAgfVxyXG4gICAgICBsaXN0Lm1hcCggKGl0ZW0sIGkpID0+IHtcclxuICAgICAgICBjb25zdCBqc29uVmFsdWU6IGFueSA9IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24obm9kZVtpdGVtXSk7XHJcbiAgICAgICAgaWYgKGpzb25WYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCkge1xyXG4gICAgICAgICAgICBqc29uVmFsdWUuc29ydCgoYSxiKSA9PiB7cmV0dXJuIGEubmFtZSA8PSBiLm5hbWUgPyAtMTogMX0pO1xyXG4gICAgICAgICAgICBqc29uVmFsdWUubWFwKCAoeDogRGlmZmVyZW50aWF0ZU5vZGUsIGkpID0+IHtcclxuICAgICAgICAgICAgICB4LmluZGV4ID0gaTtcclxuICAgICAgICAgICAgICB4LmFsdE5hbWUgPSBcIlwiICsgaTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIG5hbWU6IGl0ZW0sXHJcbiAgICAgICAgICAgIGFsdE5hbWU6IFwiXCIgKyBpLFxyXG4gICAgICAgICAgICB2YWx1ZTogXCJcIixcclxuICAgICAgICAgICAgcGFyZW50OiBwLFxyXG4gICAgICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbixcclxuICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjoganNvblZhbHVlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBuYW1lOiBpdGVtLFxyXG4gICAgICAgICAgICBhbHROYW1lOiBcIlwiICsgaSxcclxuICAgICAgICAgICAgdmFsdWU6IGpzb25WYWx1ZSxcclxuICAgICAgICAgICAgcGFyZW50OiBwLFxyXG4gICAgICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUucGFpcixcclxuICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJlc3VsdCA9IGNoaWxkcmVuO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXRlbUluQXJyYXkoc2lkZTogRGlmZmVyZW50aWF0ZU5vZGVbXSwgbm9kZTogRGlmZmVyZW50aWF0ZU5vZGUpIHtcclxuICAgIGxldCByZXN1bHQ6IERpZmZlcmVudGlhdGVOb2RlO1xyXG4gICAgY29uc3Qga2V5ID0gbm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCA/XHJcbiAgICAgICAgICAgICAgICAobm9kZS52YWx1ZSA/IFN0cmluZyhub2RlLnZhbHVlKS50b1VwcGVyQ2FzZSgpIDogXCJcIikgOlxyXG4gICAgICAgICAgICAgICAgbm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkgP1xyXG4gICAgICAgICAgICAgICAgbm9kZS5hbHROYW1lIDpcclxuICAgICAgICAgICAgICAgIG5vZGUubmFtZTtcclxuXHJcbiAgICBzaWRlLm1hcCggKGl0ZW06IERpZmZlcmVudGlhdGVOb2RlKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0udmFsdWUgJiYgU3RyaW5nKGl0ZW0udmFsdWUpLnRvVXBwZXJDYXNlKCkgPT09IGtleSkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gaXRlbTtcclxuICAgICAgICB9ICBcclxuICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSkge1xyXG4gICAgICAgIGlmIChpdGVtLmFsdE5hbWUgPT09IGtleSkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gaXRlbTtcclxuICAgICAgICB9ICBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaXRlbS5uYW1lID09PSBrZXkpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxlZnRJdGVtRnJvbVJpZ2h0SXRlbShsZWZ0Tm9kZTogRGlmZmVyZW50aWF0ZU5vZGUsIHJpZ2h0Tm9kZTogRGlmZmVyZW50aWF0ZU5vZGUpIHtcclxuICAgIGxldCByZXN1bHQ6IERpZmZlcmVudGlhdGVOb2RlO1xyXG4gICAgaWYgKCFsZWZ0Tm9kZSB8fCAhcmlnaHROb2RlKSB7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBrZXkgPSByaWdodE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwgP1xyXG4gICAgICAgICAgICAgICAgICAgIChyaWdodE5vZGUudmFsdWUgPyByaWdodE5vZGUudmFsdWUudG9VcHBlckNhc2UoKSA6IFwiXCIpIDpcclxuICAgICAgICAgICAgICAgICAgICByaWdodE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5ID9cclxuICAgICAgICAgICAgICAgICAgICByaWdodE5vZGUuYWx0TmFtZSA6XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHROb2RlLm5hbWU7XHJcblxyXG4gICAgaWYgKGxlZnROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS52YWx1ZSAmJiBTdHJpbmcobGVmdE5vZGUudmFsdWUpLnRvVXBwZXJDYXNlKCkgPT09IGtleSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGxlZnROb2RlO1xyXG4gICAgICB9ICBcclxuICAgIH0gZWxzZSBpZiAobGVmdE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5KSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS5hbHROYW1lID09PSBrZXkpIHtcclxuICAgICAgICByZXN1bHQgPSBsZWZ0Tm9kZTtcclxuICAgICAgfSAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAobGVmdE5vZGUubmFtZSA9PT0ga2V5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbGVmdE5vZGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbXBhcmUobGVmdE5vZGU6IERpZmZlcmVudGlhdGVOb2RlLCByaWdodE5vZGU6IERpZmZlcmVudGlhdGVOb2RlKSB7XHJcbiAgICBpZiAobGVmdE5vZGUudHlwZSAhPT0gcmlnaHROb2RlLnR5cGUpIHtcclxuICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudHlwZUNoYW5nZWQ7XHJcbiAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy50eXBlQ2hhbmdlZDtcclxuICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgfSBlbHNlIGlmIChsZWZ0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICBpZiAobGVmdE5vZGUudmFsdWUgIT09IHJpZ2h0Tm9kZS52YWx1ZSkge1xyXG4gICAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZDtcclxuICAgICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkO1xyXG4gICAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGxlZnROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5wYWlyKSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS5uYW1lICE9PSByaWdodE5vZGUubmFtZSkge1xyXG4gICAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZDtcclxuICAgICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdE5vZGUudmFsdWUgIT09IHJpZ2h0Tm9kZS52YWx1ZSkge1xyXG4gICAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZDtcclxuICAgICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkO1xyXG4gICAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAobGVmdE5vZGUubmFtZSAhPT0gcmlnaHROb2RlLm5hbWUpIHtcclxuICAgICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZDtcclxuICAgICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQ7XHJcbiAgICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51bmlmeShsZWZ0Tm9kZS5jaGlsZHJlbiwgcmlnaHROb2RlLmNoaWxkcmVuKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSByZUluZGV4KGxpc3Q6IERpZmZlcmVudGlhdGVOb2RlW10pIHtcclxuICAgIGxpc3QubWFwKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgIGl0ZW0uaW5kZXggPSBpO1xyXG4gICAgICB0aGlzLnJlSW5kZXgoaXRlbS5jaGlsZHJlbik7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBjb3B5SW50byhcclxuICAgICAgICAgICAgICBzaWRlOiBEaWZmZXJlbnRpYXRlTm9kZVtdLFxyXG4gICAgICAgICAgICAgIGl0ZW06IERpZmZlcmVudGlhdGVOb2RlLFxyXG4gICAgICAgICAgICAgIGluZGV4OiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cykge1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaXRlbSkpO1xyXG4gICAgc2lkZS5zcGxpY2UoaW5kZXgsIDAsIG5ld0l0ZW0pO1xyXG4gICAgdGhpcy5yZUluZGV4KHNpZGUpO1xyXG5cclxuICAgIGl0ZW0uc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgbmV3SXRlbS5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICBpdGVtLmNvdW50ZXJwYXJ0ID0gbmV3SXRlbS5pZDtcclxuICAgIG5ld0l0ZW0uY291bnRlcnBhcnQgPSBpdGVtLmlkO1xyXG4gICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhpdGVtLmNoaWxkcmVuLCBzdGF0dXMpXHJcbiAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKG5ld0l0ZW0uY2hpbGRyZW4sIHN0YXR1cylcclxuICB9XHJcbiAgcHJpdmF0ZSBzZXRDaGlsZHJlblN0YXR1cyhsaXN0LCBzdGF0dXMpe1xyXG4gICAgbGlzdC5tYXAoICh4KSA9PiB7XHJcbiAgICAgIHguc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHguY2hpbGRyZW4sIHN0YXR1cylcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIHVuaWZ5KGxlZnRTaWRlOiBEaWZmZXJlbnRpYXRlTm9kZVtdLCByaWdodFNpZGU6IERpZmZlcmVudGlhdGVOb2RlW10pIHtcclxuICAgIGxldCBpID0gMCwgaiA9IDAsIGxvb3BpbmcgPSB0cnVlO1xyXG5cclxuICAgIHdoaWxlIChsb29waW5nKSB7XHJcbiAgICAgIGxldCBsZWZ0SXRlbUluUmlnaHRTaWRlOiBEaWZmZXJlbnRpYXRlTm9kZSA9IGkgPCBsZWZ0U2lkZS5sZW5ndGggPyB0aGlzLml0ZW1JbkFycmF5KHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0pIDogdW5kZWZpbmVkO1xyXG4gICAgICBsZXQgcmlnaHRJdGVtSW5MZWZ0U2lkZTogRGlmZmVyZW50aWF0ZU5vZGUgPSBqIDwgcmlnaHRTaWRlLmxlbmd0aCA/IHRoaXMuaXRlbUluQXJyYXkobGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSkgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICBpZiAoIWxlZnRJdGVtSW5SaWdodFNpZGUgJiYgaSA8IGxlZnRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICghcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgd2hpbGUgKGkgPCBsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghcmlnaHRJdGVtSW5MZWZ0U2lkZSAmJiBqIDwgcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICghbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICB3aGlsZSAoaiA8IHJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFsZWZ0SXRlbUluUmlnaHRTaWRlKSB7XHJcbiAgICAgICAgbGVmdEl0ZW1JblJpZ2h0U2lkZSA9IGogPCByaWdodFNpZGUubGVuZ3RoID8gcmlnaHRTaWRlW2pdIDogdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghcmlnaHRJdGVtSW5MZWZ0U2lkZSkge1xyXG4gICAgICAgIHJpZ2h0SXRlbUluTGVmdFNpZGUgPSBpIDwgbGVmdFNpZGUubGVuZ3RoID8gbGVmdFNpZGVbaV0gOiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxlZnRJdGVtSW5SaWdodFNpZGUgJiYgbGVmdEl0ZW1JblJpZ2h0U2lkZS5pbmRleCAhPT0gaSkge1xyXG4gICAgICAgIHdoaWxlIChpIDwgbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICBsZWZ0SXRlbUluUmlnaHRTaWRlID0gdGhpcy5sZWZ0SXRlbUZyb21SaWdodEl0ZW0ocmlnaHRTaWRlW2ldLCBsZWZ0U2lkZVtpXSk7XHJcbiAgICAgICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSkge1xyXG4gICAgICAgICAgICBsZWZ0SXRlbUluUmlnaHRTaWRlID0gaiA8IHJpZ2h0U2lkZS5sZW5ndGggPyByaWdodFNpZGVbal0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ICBcclxuICAgICAgfVxyXG4gICAgICBpZiAocmlnaHRJdGVtSW5MZWZ0U2lkZSAmJiByaWdodEl0ZW1JbkxlZnRTaWRlLmluZGV4ICE9PSBqKSB7XHJcbiAgICAgICAgd2hpbGUgKGogPCByaWdodFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gdGhpcy5sZWZ0SXRlbUZyb21SaWdodEl0ZW0obGVmdFNpZGVbal0sIHJpZ2h0U2lkZVtqXSk7XHJcbiAgICAgICAgICBpZiAocmlnaHRJdGVtSW5MZWZ0U2lkZSkge1xyXG4gICAgICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gaSA8IGxlZnRTaWRlLmxlbmd0aCA/IGxlZnRTaWRlW2ldIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiBpIDwgbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgbGV0IHggPSB0aGlzLml0ZW1JbkFycmF5KHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0pO1xyXG4gICAgICAgIGlmICh4ICYmIHguaW5kZXggIT09IGxlZnRJdGVtSW5SaWdodFNpZGUuaW5kZXgpIHtcclxuICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIGxlZnRJdGVtSW5SaWdodFNpZGUgPSBqIDwgcmlnaHRTaWRlLmxlbmd0aCA/IHJpZ2h0U2lkZVtqXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHJpZ2h0SXRlbUluTGVmdFNpZGUgJiYgaiA8IHJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICBsZXQgeCA9IHRoaXMuaXRlbUluQXJyYXkobGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSk7XHJcbiAgICAgICAgaWYgKHggJiYgeC5pbmRleCAhPT0gcmlnaHRJdGVtSW5MZWZ0U2lkZS5pbmRleCkge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gaSA8IGxlZnRTaWRlLmxlbmd0aCA/IGxlZnRTaWRlW2ldIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiByaWdodEl0ZW1JbkxlZnRTaWRlKSB7XHJcbiAgICAgICAgaWYgKGxlZnRJdGVtSW5SaWdodFNpZGUucGFyZW50ICE9PSByaWdodEl0ZW1JbkxlZnRTaWRlLnBhcmVudCkge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNvbXBhcmUobGVmdEl0ZW1JblJpZ2h0U2lkZSwgcmlnaHRJdGVtSW5MZWZ0U2lkZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGorKztpKys7XHJcbiAgICAgIH1cclxuICAgICAgbG9vcGluZyA9IChpIDwgbGVmdFNpZGUubGVuZ3RoIHx8IGogPCByaWdodFNpZGUubGVuZ3RoKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSB0b0ludGVybmFsU3RydWN0aW9uKGxlZnROb2RlLCByaWdodE5vZGUpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHtcclxuICAgICAgbGVmdFNpZGU6IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24obGVmdE5vZGUpLFxyXG4gICAgICByaWdodFNpZGU6IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24ocmlnaHROb2RlKVxyXG4gICAgfTtcclxuICAgIHRoaXMudW5pZnkocmVzdWx0LmxlZnRTaWRlLCByZXN1bHQucmlnaHRTaWRlKTtcclxuXHJcbiAgICBpZiAodGhpcy5vbmx5U2hvd0RpZmZlcmVuY2VzKSB7XHJcbiAgICAgIHJlc3VsdC5sZWZ0U2lkZSA9IHRoaXMuZmlsdGVyVW5jaGFuZ2VkKHJlc3VsdC5sZWZ0U2lkZSk7XHJcbiAgICAgIHJlc3VsdC5yaWdodFNpZGUgPSB0aGlzLmZpbHRlclVuY2hhbmdlZChyZXN1bHQucmlnaHRTaWRlKTtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHByaXZhdGUgZmlsdGVyVW5jaGFuZ2VkKGxpc3Q6IERpZmZlcmVudGlhdGVOb2RlW10pIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgXHJcbiAgICBsaXN0Lm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgaXRlbS5jaGlsZHJlbiA9IHRoaXMuZmlsdGVyVW5jaGFuZ2VkKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICBpZiAoKGl0ZW0udHlwZSA+IERpZmZlcmVudGlhdGVOb2RlVHlwZS5wYWlyICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoKSB8fFxyXG4gICAgICAgICAgaXRlbS5zdGF0dXMgIT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQpIHtcclxuICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXN1bHQubWFwKCAoeDogRGlmZmVyZW50aWF0ZU5vZGUsIGkpID0+IHtcclxuICAgICAgeC5pbmRleCA9IGk7XHJcbiAgICAgIHguYWx0TmFtZSA9IFwiXCIgKyBpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xyXG4gICAgaWYgKGNoYW5nZXMuYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCB8fFxyXG4gICAgICBjaGFuZ2VzLm9ubHlTaG93RGlmZmVyZW5jZXMgfHxcclxuICAgICAgY2hhbmdlcy5sZWZ0U2lkZU9iamVjdCB8fFxyXG4gICAgICBjaGFuZ2VzLm5hbWVkUm9vdE9iamVjdCB8fFxyXG4gICAgICBjaGFuZ2VzLnJpZ2h0U2lkZU9iamVjdCkge1xyXG4gICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubmdPbkluaXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgc2V0VGltZW91dCgoKT0+dGhpcy5pbml0KCksNjY2KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBjYXRlZ29yaXplZE5hbWUoaXRlbSkge1xyXG4gICAgbGV0IG5hbWUgPSBcIlwiO1xyXG4gICAgdGhpcy5jYXRlZ29yaXplQnkubWFwKChjYXRlZ29yeSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5uYW1lID09PSBjYXRlZ29yeSkge1xyXG4gICAgICAgIG5hbWUgPSBpdGVtLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuYW1lO1xyXG4gIH1cclxuICBwcml2YXRlIHNpZGVDYXRlZ29yaXplZE5hbWUoc2lkZSkge1xyXG4gICAgc2lkZS5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5hbWVzID0gW107XHJcbiAgICAgIGl0ZW0uY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNhdGVnb3JpemVkTmFtZShjaGlsZCk7XHJcbiAgICAgICAgaWYoU3RyaW5nKG5hbWUpLmxlbmd0aCkge1xyXG4gICAgICAgICAgbmFtZXMucHVzaChuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBpdGVtLmNhdGVnb3JpemVCeSA9IG5hbWVzLmxlbmd0aCA+IDEgPyBuYW1lcy5qb2luKFwiIC0gXCIpIDogbmFtZXNbMF07XHJcbiAgICAgIGl0ZW0uY29sbGFwc2VkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5sZWZ0U2lkZU9iamVjdCAmJiB0aGlzLnJpZ2h0U2lkZU9iamVjdCkge1xyXG4gICAgICBjb25zdCBsZWZ0ID0gKHRoaXMubGVmdFNpZGVPYmplY3QgaW5zdGFuY2VvZiBBcnJheSkgID8gdGhpcy5sZWZ0U2lkZU9iamVjdCA6IFt0aGlzLmxlZnRTaWRlT2JqZWN0XVxyXG4gICAgICBjb25zdCByaWdodCA9ICh0aGlzLnJpZ2h0U2lkZU9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSAgPyB0aGlzLnJpZ2h0U2lkZU9iamVjdCA6IFt0aGlzLnJpZ2h0U2lkZU9iamVjdF1cclxuICAgICAgY29uc3QgY29tcGFyaXNpb24gPSB0aGlzLnRvSW50ZXJuYWxTdHJ1Y3Rpb24obGVmdCwgcmlnaHQpO1xyXG4gICAgICBpZiAodGhpcy5jYXRlZ29yaXplQnkpIHtcclxuICAgICAgICB0aGlzLnNpZGVDYXRlZ29yaXplZE5hbWUoY29tcGFyaXNpb24ubGVmdFNpZGUpO1xyXG4gICAgICAgIHRoaXMuc2lkZUNhdGVnb3JpemVkTmFtZShjb21wYXJpc2lvbi5yaWdodFNpZGUpO1xyXG4gICAgICB9ICBcclxuICAgICAgdGhpcy5sZWZ0U2lkZSA9IFt7XHJcbiAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgIHZhbHVlOiBcIlJvb3RcIixcclxuICAgICAgICBpbmRleDogMCxcclxuICAgICAgICBwYXJlbnQ6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgZXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgICAgaXNSb290OiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjb21wYXJpc2lvbi5sZWZ0U2lkZVxyXG4gICAgICB9XTtcclxuICAgICAgdGhpcy5yaWdodFNpZGU9IFt7XHJcbiAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgIHZhbHVlOiBcIlJvb3RcIixcclxuICAgICAgICBpbmRleDogMCxcclxuICAgICAgICBwYXJlbnQ6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgZXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgICAgaXNSb290OiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjb21wYXJpc2lvbi5yaWdodFNpZGVcclxuICAgICAgfV07XHJcbiAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDb3VudERpZmZlcmVuY2UoKTtcclxuICAgICAgfSwzMzMpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIGZpcmVDb3VudERpZmZlcmVuY2UoKSB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgdGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbi5tYXAoIChsaXN0SXRlbSkgPT4ge1xyXG4gICAgICBsaXN0SXRlbS5jaGlsZHJlbi5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgaWYoaXRlbS5zdGF0dXMgIT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQpIHtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICB0aGlzLm9uZGlmZmVyZW5jZS5lbWl0KGNvdW50KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBsb29rdXBDaGlsZE9mKHNpZGUsIHBhcmVudE9iamVjdCwgaWQpIHtcclxuICAgIGxldCBmb3VuZEl0ZW0gPSB1bmRlZmluZWQ7XHJcbiAgICBpZiAoc2lkZS5pZCA9PT0gaWQpIHtcclxuICAgICAgZm91bmRJdGVtID0ge3BhcmVudDogcGFyZW50T2JqZWN0LCBub2RlOiBzaWRlfTtcclxuICAgIH0gZWxzZSBpZiAoc2lkZS5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgc2lkZS5jaGlsZHJlbi5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgaWYgKCFmb3VuZEl0ZW0pIHtcclxuICAgICAgICAgIGZvdW5kSXRlbSA9IHRoaXMubG9va3VwQ2hpbGRPZihpdGVtLCB1bmRlZmluZWQsIGlkKTtcclxuICAgICAgICAgIGlmIChmb3VuZEl0ZW0gJiYgZm91bmRJdGVtLnBhcmVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvdW5kSXRlbS5wYXJlbnQgPSBzaWRlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlkID09PSBpZCkge1xyXG4gICAgICAgICAgICBmb3VuZEl0ZW0gPSB7cGFyZW50OiBzaWRlLCBub2RlOiBpdGVtfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBcclxuICAgIHJldHVybiBmb3VuZEl0ZW07XHJcbiAgfVxyXG4gIHByaXZhdGUgcGVyZm9ybUFkdmFuY2VUb1JpZ2h0KGxlZnRTaWRlSW5mbywgcmlnaHRTaWRlSW5mbywgc3RhdHVzLCBpKSB7XHJcbiAgICBjb25zdCBtb2RpZmllZENoaWxkcmVuID0gdGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpXS5jaGlsZHJlbjtcclxuICAgIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UobGVmdFNpZGVJbmZvLm5vZGUuaW5kZXgsIDEpO1xyXG4gICAgICByaWdodFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UocmlnaHRTaWRlSW5mby5ub2RlLmluZGV4LCAxKTtcclxuICAgICAgdGhpcy5yZUluZGV4KGxlZnRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgICB0aGlzLnJlSW5kZXgocmlnaHRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLm5hbWUgPSByaWdodFNpZGVJbmZvLm5vZGUubmFtZTtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkKSB7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS52YWx1ZSA9IGxlZnRTaWRlSW5mby5ub2RlLnZhbHVlO1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy50eXBlQ2hhbmdlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS50eXBlID0gcmlnaHRTaWRlSW5mby5ub2RlLnR5cGU7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuID0gcmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKSA9PntcclxuICAgICAgdGhpcy5vbmFkdmFuY2UuZW1pdCh7XHJcbiAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgbm9kZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShtb2RpZmllZENoaWxkcmVuLCBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbilcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZmlyZUNvdW50RGlmZmVyZW5jZSgpO1xyXG4gICAgfSwgNjYpO1xyXG4gIH1cclxuICBwcml2YXRlIHBlcmZvcm1BZHZhbmNlVG9MZWZ0KGxlZnRTaWRlSW5mbywgcmlnaHRTaWRlSW5mbywgc3RhdHVzLCBpKSB7XHJcbiAgICBjb25zdCBtb2RpZmllZENoaWxkcmVuID0gdGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baV0uY2hpbGRyZW47XHJcbiAgICBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGxlZnRTaWRlSW5mby5ub2RlLmluZGV4LCAxKTtcclxuICAgICAgcmlnaHRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKHJpZ2h0U2lkZUluZm8ubm9kZS5pbmRleCwgMSk7XHJcbiAgICAgIHRoaXMucmVJbmRleChsZWZ0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuKTtcclxuICAgICAgdGhpcy5yZUluZGV4KHJpZ2h0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuKTtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZCkge1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUubmFtZSA9IGxlZnRTaWRlSW5mby5ub2RlLm5hbWU7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS52YWx1ZSA9IHJpZ2h0U2lkZUluZm8ubm9kZS52YWx1ZTtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudHlwZUNoYW5nZWQpIHtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnR5cGUgPSBsZWZ0U2lkZUluZm8ubm9kZS50eXBlO1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4gPSBsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbjtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoKCkgPT57XHJcbiAgICAgIHRoaXMub25yZXZlcnQuZW1pdCh7XHJcbiAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgbm9kZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShtb2RpZmllZENoaWxkcmVuLCBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbilcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZmlyZUNvdW50RGlmZmVyZW5jZSgpO1xyXG4gICAgfSwgNjYpO1xyXG4gIH1cclxuICBhZHZhbmNlKGV2ZW50KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KGV2ZW50Lm5vZGUucGF0aC5zcGxpdChcIixcIilbMV0pO1xyXG5cclxuICAgIGlmIChldmVudC50eXBlID09PSAnYWR2YW5jZScpIHtcclxuICAgICAgdGhpcy5wZXJmb3JtQWR2YW5jZVRvTGVmdChcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMubGVmdFNpZGVbMF0sIGV2ZW50Lm5vZGUuaWQpLCBcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLCB0aGlzLnJpZ2h0U2lkZVswXSwgZXZlbnQubm9kZS5jb3VudGVycGFydCksIFxyXG4gICAgICAgIGV2ZW50Lm5vZGUuc3RhdHVzLCBpbmRleCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBlcmZvcm1BZHZhbmNlVG9SaWdodChcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMubGVmdFNpZGVbMF0sIGV2ZW50Lm5vZGUuY291bnRlcnBhcnQpLCBcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLCB0aGlzLnJpZ2h0U2lkZVswXSwgZXZlbnQubm9kZS5pZCksIFxyXG4gICAgICAgIGV2ZW50Lm5vZGUuc3RhdHVzLCBpbmRleCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGF1dG9FeHBhbmQoZXZlbnQpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoZXZlbnQuc3BsaXQoXCIsXCIpWzFdKTtcclxuICAgIGNvbnN0IGxjID0gdGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdO1xyXG4gICAgY29uc3QgcmMgPSB0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIFxyXG4gICAgbGMuY29sbGFwc2VkID0gIWxjLmNvbGxhcHNlZDtcclxuICAgIHJjLmNvbGxhcHNlZCA9ICFyYy5jb2xsYXBzZWQ7XHJcbiAgfVxyXG4gIG9uaG92ZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoZXZlbnQucGF0aC5zcGxpdChcIixcIilbMV0pO1xyXG5cclxuICAgIHRoaXMucmlnaHRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XS5jaGlsZHJlbltldmVudC5pbmRleF0uaG92ZXIgPSBldmVudC5ob3ZlcjtcclxuICAgIHRoaXMubGVmdFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLmNoaWxkcmVuW2V2ZW50LmluZGV4XS5ob3ZlciA9IGV2ZW50LmhvdmVyO1xyXG4gIH1cclxufVxyXG4iXX0=