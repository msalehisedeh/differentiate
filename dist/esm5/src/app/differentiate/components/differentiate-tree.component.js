/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DifferentiateNodeStatus } from '../interfaces/differentiate.interfaces';
var DifferentiateTree = /** @class */ (function () {
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
        this.onhover = new EventEmitter();
        this.onrevert = new EventEmitter();
        this.onexpand = new EventEmitter();
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
        { type: Component, args: [{
                    selector: 'differentiate-tree',
                    template: "<div *ngIf=\"categorizeBy\" \r\n  class=\"diff-heading\" \r\n  (click)=\"expand($event)\">\r\n  <span class=\"arrow\" *ngIf=\"collapsed\">&#9658;</span>\r\n  <span class=\"arrow\" *ngIf=\"!collapsed\">&#9660;</span>\r\n  <span [textContent]=\"categorizeBy\"></span>\r\n  <span class=\"counter\" [textContent]=\"changCounter()\"></span>\r\n</div>\r\n<ul [class]=\"side\" [class.child]=\"depth ===2 || (categorizeBy && categorizeBy.length)\" [class.collapsed]=\"categorizeBy && collapsed\">\r\n  <li  *ngFor=\"let child of children\" \r\n    (mouseout)=\"depth === 2 ? mouseOvered($event, false, child.index) : null\"\r\n    (mouseover)=\"depth === 2 ? mouseOvered($event, true, child.index) : null\"\r\n    [class.hover]=\"child.hover\"\r\n    [class.added]=\"child.status === 5\" \r\n    [class.removed]=\"child.status === 6\" \r\n    [class.type-changed]=\"child.status === 2\" \r\n    [class.name-changed]=\"child.status === 3\" \r\n    [class.value-changed]=\"child.status === 4\">\r\n    <div class='tree-node' [ngClass]=\"'depth-' + depth\" [class.collapsed]=\"child.collapsed\" [id] = \"child.id\">\r\n      <span [title]=\"rightSideToolTip\"\r\n        class=\"do\" \r\n        tabindex=\"0\"\r\n        aria-hidden=\"true\"\r\n        (keyup)=\"keyup($event)\"\r\n        (click)=\"advanceToRightSide(child)\"\r\n        *ngIf=\"showLeftActionButton && status !== child.status && child.status > 1\">&#9100;</span>\r\n      <span *ngIf='child.name && child.name!=null'\r\n        class='name' \r\n        [innerHTML]=\"child.name.length ? child.name : '&nbsp;'\">\r\n      </span>\r\n      <span *ngIf='child.value && child.value!=null'\r\n        class='value' \r\n        [class.string]=\"depth > 0 && child.value && child.value.length\"\r\n        [innerHTML]=\"child.value ? child.value : '&nbsp;'\">\r\n      </span>\r\n      <span [title]=\"leftSideToolTip\"\r\n        class=\"undo\" \r\n        tabindex=\"0\"\r\n        aria-hidden=\"true\"\r\n        (keyup)=\"keyup($event)\"\r\n        (click)=\"advanceToLeftSide(child)\"\r\n        *ngIf=\"showRightActionButton && status !== child.status && child.status > 1\">&#9100;</span>\r\n    </div>\r\n    <differentiate-tree *ngIf=\"child.children.length\" \r\n        [level]=\"depth+1\" \r\n        [status]=\"child.status\" \r\n        [collapsed]=\"child.collapsed\"\r\n        [categorizeBy]=\"child.categorizeBy\"\r\n        [showLeftActionButton]=\"showLeftActionButton\" \r\n        [leftSideToolTip]=\"leftSideToolTip\"\r\n        [showRightActionButton]=\"showRightActionButton\" \r\n        [rightSideToolTip]=\"rightSideToolTip\"\r\n        [objectPath]=\"objectPath + (objectPath.length ? ',':'') + child.index\"\r\n        (onhover)=\"bubleup($event)\"\r\n        (onrevert)=\"advance($event)\"\r\n        (onexpand)=\"autoExpand($event)\"\r\n        [class.child-node]=\"child.parent != 4\" \r\n        [children]='child.children'></differentiate-tree>\r\n    <div *ngIf=\"child.status > 2\" class=\"upper\" [class.collapsed]=\"child.collapsed\" [ngClass]=\"'depth-' + depth\" ></div>\r\n    <div *ngIf=\"child.status > 2\" class=\"lower\" [class.collapsed]=\"child.collapsed\" [ngClass]=\"'depth-' + depth\" ></div>\r\n  </li>\r\n</ul>\r\n\r\n",
                    styles: [":host{box-sizing:border-box;width:100%}:host.root{float:left;width:50%}:host.child-node{float:left}.diff-heading{padding:5px;font-weight:700;background:rgba(0,0,0,.02);border-bottom:1px solid rgba(0,0,0,.1);color:#666;cursor:pointer}.diff-heading .arrow{color:#999;font-size:.6rem;font-weight:700}.diff-heading .counter{float:right;border-radius:50%;width:16px;text-align:center;background-color:rgba(0,0,0,.4);font-size:.8rem;color:#fff}.diff-heading:first-child{border-top:1px solid rgba(0,0,0,.1)}ul{box-sizing:border-box;list-style:none;padding:0;width:100%}ul .collapsed,ul.collapsed{display:none!important}ul li .hover{background-color:rgba(0,0,0,.1)}ul li .hover .do,ul li .hover .undo{text-decoration:underline}ul li .tree-node{position:relative}ul li .tree-node.depth-0{display:none}ul li .tree-node .do,ul li .tree-node .undo{cursor:pointer;color:#962323;position:absolute;text-align:center;top:0;width:18px;z-index:2;height:100%}ul li .tree-node .undo{right:0}ul li .tree-node .do{left:0}ul.undefined li:hover{background-color:rgba(0,0,0,.1)}ul.left-side{border-right:1px solid rgba(0,0,0,.1);margin:0}ul.left-side li{position:relative;display:table;width:100%}ul.left-side li .do,ul.left-side li .undo{border-right:1px solid #ddd}ul.left-side li .tree-node:before{position:absolute;top:0;left:0;width:18px;z-index:1;background:rgba(0,0,0,.02);height:100%;border-right:1px solid #ddd;content:' ';display:block}ul.left-side li.added .name,ul.left-side li.added .value{opacity:.2;font-style:italic}ul.left-side li.added .upper{border-radius:0 0 100%;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;top:0;right:0}ul.left-side li.added .upper.depth-1{border:2px solid #245024;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-2{border:2px dotted #378637;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-3{border:1px solid #48ad48;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-4{border:1px dotted #57d657;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-5{border:1px dashed #67fa67;border-top-width:0;border-left-width:0}ul.left-side li.added .lower{border-radius:0 100% 0 0;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;bottom:0;right:0}ul.left-side li.added .lower.depth-1{border:2px solid #245024;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-2{border:2px dotted #378637;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-3{border:1px solid #48ad48;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-4{border:1px dotted #57d657;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-5{border:1px dashed #67fa67;border-bottom-width:0;border-left-width:0}ul.left-side li.removed .upper{box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.removed .upper:after{content:' - ';color:#962323;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.removed .lower{display:none}ul.left-side li.removed .tree-node span,ul.left-side li.type-changed .tree-node span{color:#962323}ul.left-side li.name-changed .upper{box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.name-changed .upper:after{content:' ~ ';color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.name-changed .tree-node .name{color:#000060}ul.left-side li.value-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:66px;top:0;right:0}ul.left-side li.value-changed .upper:after{content:' ~ ';color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.value-changed .tree-node .value{color:#000060}ul.right-side{border-left:1px solid rgba(0,0,0,.1);margin:0}ul.right-side li{position:relative;display:table;width:100%}ul.right-side li .do,ul.right-side li .undo{border-left:1px solid #ddd}ul.right-side li .tree-node:after{position:absolute;top:0;right:0;width:18px;z-index:1;background:rgba(0,0,0,.02);height:100%;border-left:1px solid #ddd;content:' ';display:block}ul.right-side li.added .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:90%;top:0;left:0}ul.right-side li.added .upper:after{content:'+';color:#4a4;font-weight:700;padding-left:5px;font-size:1.2rem;line-height:1.2rem}ul.right-side li.added .lower{display:none}ul.right-side li.added .tree-node span{color:#4a4}ul.right-side li.removed .name,ul.right-side li.removed .value{-webkit-text-decoration-line:line-through;text-decoration-line:line-through;-webkit-text-decoration-color:#962323;text-decoration-color:#962323}ul.right-side li.removed .upper{border-radius:0 0 0 100%;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;top:0}ul.right-side li.removed .upper.depth-1{border:2px solid #600000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-2{border:2px dotted maroon;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-3{border:1px solid #a00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-4{border:1px dotted #c00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-5{border:1px dashed #f00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .lower{border-radius:100% 0 0;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;bottom:0}ul.right-side li.removed .lower.depth-1{border:2px solid #600000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-2{border:2px dotted maroon;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-3{border:1px solid #a00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-4{border:1px dotted #c00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-5{border:1px dashed #f00000;border-bottom-width:0;border-right-width:0}ul.right-side li.type-changed .tree-node span{color:#962323}ul.right-side li.name-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.name-changed .upper:before{content:' ~ ';color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.name-changed .tree-node .name{color:#000060}ul.right-side li.value-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.value-changed .upper:before{content:' ~ ';color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.value-changed .tree-node .value{color:#000060}ul .tree-node{box-sizing:border-box;color:#7c9eb2;display:table;padding:0;position:relative;margin:0;width:100%}ul .tree-node.depth-0{padding-left:5px}ul .tree-node.depth-1{padding-left:20px}ul .tree-node.depth-2{padding-left:40px}ul .tree-node.depth-3{padding-left:60px}ul .tree-node.depth-4{padding-left:80px}ul .tree-node.depth-5{padding-left:100px}ul .tree-node.depth-6{padding-left:120px}ul .tree-node.depth-7{padding-left:140px}ul .tree-node.depth-8{padding-left:160px}ul .tree-node.depth-9{padding-left:180px}ul .tree-node.depth-10{padding-left:200px}ul .tree-node .name{color:#444;font-weight:700}ul .tree-node .name:after{content:':'}ul .tree-node .value.string:after,ul .tree-node .value.string:before{content:'\"'}"]
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
    return DifferentiateTree;
}());
export { DifferentiateTree };
if (false) {
    /** @type {?} */
    DifferentiateTree.prototype.depth;
    /** @type {?} */
    DifferentiateTree.prototype.collapsed;
    /** @type {?} */
    DifferentiateTree.prototype.children;
    /** @type {?} */
    DifferentiateTree.prototype.showLeftActionButton;
    /** @type {?} */
    DifferentiateTree.prototype.showRightActionButton;
    /** @type {?} */
    DifferentiateTree.prototype.status;
    /** @type {?} */
    DifferentiateTree.prototype.side;
    /** @type {?} */
    DifferentiateTree.prototype.level;
    /** @type {?} */
    DifferentiateTree.prototype.objectPath;
    /** @type {?} */
    DifferentiateTree.prototype.categorizeBy;
    /** @type {?} */
    DifferentiateTree.prototype.leftSideToolTip;
    /** @type {?} */
    DifferentiateTree.prototype.rightSideToolTip;
    /** @type {?} */
    DifferentiateTree.prototype.onhover;
    /** @type {?} */
    DifferentiateTree.prototype.onrevert;
    /** @type {?} */
    DifferentiateTree.prototype.onexpand;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2RpZmZlcmVudGlhdGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2RpZmZlcmVudGlhdGUvY29tcG9uZW50cy9kaWZmZXJlbnRpYXRlLXRyZWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFLQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLHdDQUF3QyxDQUFDOzs7eUJBV2pFLElBQUk7b0NBTU8sS0FBSztxQ0FHSixLQUFLO3NCQUdwQixDQUFDO29CQUdILEVBQUU7cUJBR0QsR0FBRzswQkFHRSxFQUFFOytCQU1HLGdCQUFnQjtnQ0FHZixpQkFBaUI7dUJBRzFCLElBQUksWUFBWSxFQUFFO3dCQUdqQixJQUFJLFlBQVksRUFBRTt3QkFHbEIsSUFBSSxZQUFZLEVBQUU7Ozs7O0lBRTdCLG9DQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNuQzs7Ozs7SUFFRCxtQ0FBTzs7OztJQUFQLFVBQVEsS0FBSztRQUNYLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxQjs7Ozs7SUFFRCxpQ0FBSzs7OztJQUFMLFVBQU0sS0FBSzs7UUFDVCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDeEI7S0FDQTs7OztJQUVELHdDQUFZOzs7SUFBWjs7UUFDRSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBRSxVQUFDLElBQUk7WUFDdEIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxLQUFLLEVBQUUsQ0FBQzthQUNUO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUNkOzs7OztJQUVELGtDQUFNOzs7O0lBQU4sVUFBTyxLQUFLO1FBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO0tBQ3ZDOzs7OztJQUNELHNDQUFVOzs7O0lBQVYsVUFBVyxLQUFLO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0I7Ozs7O0lBQ0QsOENBQWtCOzs7O0lBQWxCLFVBQW1CLEtBQUs7UUFDdEIsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQSxDQUFDLENBQUEsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMvRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7S0FDbkQ7Ozs7O0lBQ0QsNkNBQWlCOzs7O0lBQWpCLFVBQWtCLEtBQUs7UUFDckIsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQSxDQUFDLENBQUEsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMvRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7S0FDbEQ7Ozs7O0lBQ0QsbUNBQU87Ozs7SUFBUCxVQUFRLEtBQUs7O1FBRVgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0I7Ozs7Ozs7SUFFRCx1Q0FBVzs7Ozs7O0lBQVgsVUFBWSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLEtBQUssRUFBRSxJQUFJO2dCQUNYLEtBQUssRUFBRSxDQUFDO2dCQUNSLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVTthQUN0QixDQUFDLENBQUM7U0FDSjtLQUNGOztnQkEzR0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLGtxR0FBa0Q7O2lCQUVuRDs7OzRCQUlFLEtBQUssU0FBQyxXQUFXOzJCQUdqQixLQUFLLFNBQUMsVUFBVTt1Q0FHaEIsS0FBSyxTQUFDLHNCQUFzQjt3Q0FHNUIsS0FBSyxTQUFDLHVCQUF1Qjt5QkFHN0IsS0FBSyxTQUFDLFFBQVE7dUJBR2QsS0FBSyxTQUFDLE1BQU07d0JBR1osS0FBSyxTQUFDLE9BQU87NkJBR2IsS0FBSyxTQUFDLFlBQVk7K0JBR2xCLEtBQUssU0FBQyxjQUFjO2tDQUdwQixLQUFLLFNBQUMsaUJBQWlCO21DQUd2QixLQUFLLFNBQUMsa0JBQWtCOzBCQUd4QixNQUFNLFNBQUMsU0FBUzsyQkFHaEIsTUFBTSxTQUFDLFVBQVU7MkJBR2pCLE1BQU0sU0FBQyxVQUFVOzs0QkE5RHBCOztTQW9CYSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBBIGNvbXBhcmlzaW9uIHRyZWUgd2lsbCBsYXlvdXQgZWFjaCBhdHRyaWJ1dGUgb2YgYSBqc29uIGRlZXAgdGhyb3VnaCBpdHMgaGVpcmFyY2h5IHdpdGggZ2l2ZW4gdmlzdWFsIHF1ZXVlc1xyXG4gKiB0aGF0IHJlcHJlc2VudHMgYSBkZWxldGlvbiwgYWRpdGlvbiwgb3IgY2hhbmdlIG9mIGF0dHJpYnV0ZSBmcm9tIHRoZSBvdGhlciB0cmVlLiBUaGUgc3RhdHVzIG9mIGVhY2ggbm9kZSBpcyBcclxuICogZXZhbHVhdGVkIGJ5IHRoZSBwYXJlbnQgY29tcGFyaXNpb24gdG9vbC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge0RpZmZlcmVudGlhdGVOb2RlU3RhdHVzfSBmcm9tICcuLi9pbnRlcmZhY2VzL2RpZmZlcmVudGlhdGUuaW50ZXJmYWNlcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2RpZmZlcmVudGlhdGUtdHJlZScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RpZmZlcmVudGlhdGUtdHJlZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGlmZmVyZW50aWF0ZS10cmVlLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWZmZXJlbnRpYXRlVHJlZSBpbXBsZW1lbnRzIE9uSW5pdHtcclxuICBkZXB0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJjb2xsYXBzZWRcIilcclxuICBjb2xsYXBzZWQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoXCJjaGlsZHJlblwiKVxyXG4gIGNoaWxkcmVuO1xyXG5cclxuICBASW5wdXQoXCJzaG93TGVmdEFjdGlvbkJ1dHRvblwiKVxyXG4gIHNob3dMZWZ0QWN0aW9uQnV0dG9uID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcInNob3dSaWdodEFjdGlvbkJ1dHRvblwiKVxyXG4gIHNob3dSaWdodEFjdGlvbkJ1dHRvbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoXCJzdGF0dXNcIilcclxuICBzdGF0dXMgPSAxO1xyXG5cclxuICBASW5wdXQoXCJzaWRlXCIpXHJcbiAgc2lkZSA9IFwiXCI7XHJcblxyXG4gIEBJbnB1dChcImxldmVsXCIpXHJcbiAgbGV2ZWwgPSBcIjBcIjtcclxuXHJcbiAgQElucHV0KFwib2JqZWN0UGF0aFwiKVxyXG4gIG9iamVjdFBhdGggPSBcIlwiO1xyXG5cclxuICBASW5wdXQoXCJjYXRlZ29yaXplQnlcIilcclxuICBjYXRlZ29yaXplQnk6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwibGVmdFNpZGVUb29sVGlwXCIpXHJcbiAgbGVmdFNpZGVUb29sVGlwID0gXCJ0YWtlIGxlZnQgc2lkZVwiO1xyXG5cclxuICBASW5wdXQoXCJyaWdodFNpZGVUb29sVGlwXCIpXHJcbiAgcmlnaHRTaWRlVG9vbFRpcCA9IFwidGFrZSByaWdodCBzaWRlXCI7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmhvdmVyXCIpXHJcbiAgb25ob3ZlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9ucmV2ZXJ0XCIpXHJcbiAgb25yZXZlcnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmV4cGFuZFwiKVxyXG4gIG9uZXhwYW5kID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZGVwdGggPSBwYXJzZUludCh0aGlzLmxldmVsKTtcclxuICB9XHJcblxyXG4gIGJ1YmxldXAoZXZlbnQpIHtcclxuICAgIGV2ZW50LnNpZGUgPSB0aGlzLnNpZGU7XHJcbiAgICB0aGlzLm9uaG92ZXIuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBrZXl1cChldmVudCkge1xyXG4gICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgaWYgKGNvZGUgPT09IDEzKSB7XHJcbiAgICAgIGV2ZW50LnRhcmdldC5jbGljaygpO1xyXG5cdFx0fVxyXG4gIH1cclxuXHJcbiAgY2hhbmdDb3VudGVyKCkge1xyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIHRoaXMuY2hpbGRyZW4ubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICBpZihpdGVtLnN0YXR1cyAhPT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCkge1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gY291bnQ7XHJcbiAgfVxyXG5cclxuICBleHBhbmQoZXZlbnQpIHtcclxuICAgIHRoaXMub25leHBhbmQuZW1pdCggdGhpcy5vYmplY3RQYXRoICk7XHJcbiAgfVxyXG4gIGF1dG9FeHBhbmQoZXZlbnQpIHtcclxuICAgIHRoaXMub25leHBhbmQuZW1pdChldmVudCk7XHJcbiAgfVxyXG4gIGFkdmFuY2VUb1JpZ2h0U2lkZShjaGlsZCkge1xyXG4gICAgY2hpbGQucGF0aCA9IHRoaXMub2JqZWN0UGF0aCArICh0aGlzLm9iamVjdFBhdGgubGVuZ3RoID8gJywnOicnKSArIGNoaWxkLmluZGV4O1xyXG4gICAgdGhpcy5vbnJldmVydC5lbWl0KHt0eXBlOlwiYWR2YW5jZVwiLCBub2RlOiBjaGlsZH0pO1xyXG4gIH1cclxuICBhZHZhbmNlVG9MZWZ0U2lkZShjaGlsZCkge1xyXG4gICAgY2hpbGQucGF0aCA9IHRoaXMub2JqZWN0UGF0aCArICh0aGlzLm9iamVjdFBhdGgubGVuZ3RoID8gJywnOicnKSArIGNoaWxkLmluZGV4O1xyXG4gICAgdGhpcy5vbnJldmVydC5lbWl0KHt0eXBlOlwicmV2ZXJ0XCIsIG5vZGU6IGNoaWxkfSk7XHJcbiAgfVxyXG4gIGFkdmFuY2UoZXZlbnQpIHtcclxuICAgIC8vIGJ1YmJsZSB1cCB0aGUgdW5kbyBldmVudC5cclxuICAgIHRoaXMub25yZXZlcnQuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBtb3VzZU92ZXJlZChldmVudCwgZmxhZywgaSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5kZXB0aCA9PT0gMikge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMub25ob3Zlci5lbWl0KHtcclxuICAgICAgICBob3ZlcjogZmxhZyxcclxuICAgICAgICBpbmRleDogaSxcclxuICAgICAgICBwYXRoOiB0aGlzLm9iamVjdFBhdGhcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==