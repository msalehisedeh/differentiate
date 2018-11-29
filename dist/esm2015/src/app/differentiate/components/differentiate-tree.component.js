/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DifferentiateNodeStatus } from '../interfaces/differentiate.interfaces';
export class DifferentiateTree {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2RpZmZlcmVudGlhdGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2RpZmZlcmVudGlhdGUvY29tcG9uZW50cy9kaWZmZXJlbnRpYXRlLXRyZWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFLQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBTy9FLE1BQU07O3lCQUlRLElBQUk7b0NBTU8sS0FBSztxQ0FHSixLQUFLO3NCQUdwQixDQUFDO29CQUdILEVBQUU7cUJBR0QsR0FBRzswQkFHRSxFQUFFOytCQU1HLGdCQUFnQjtnQ0FHZixpQkFBaUI7dUJBRzFCLElBQUksWUFBWSxFQUFFO3dCQUdqQixJQUFJLFlBQVksRUFBRTt3QkFHbEIsSUFBSSxZQUFZLEVBQUU7Ozs7O0lBRTdCLFFBQVE7UUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkM7Ozs7O0lBRUQsT0FBTyxDQUFDLEtBQUs7UUFDWCxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUI7Ozs7O0lBRUQsS0FBSyxDQUFDLEtBQUs7O1FBQ1QsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoQixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3hCO0tBQ0E7Ozs7SUFFRCxZQUFZOztRQUNWLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxLQUFLLEVBQUUsQ0FBQzthQUNUO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUNkOzs7OztJQUVELE1BQU0sQ0FBQyxLQUFLO1FBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO0tBQ3ZDOzs7OztJQUNELFVBQVUsQ0FBQyxLQUFLO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0I7Ozs7O0lBQ0Qsa0JBQWtCLENBQUMsS0FBSztRQUN0QixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBLENBQUMsQ0FBQSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQy9FLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztLQUNuRDs7Ozs7SUFDRCxpQkFBaUIsQ0FBQyxLQUFLO1FBQ3JCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUEsQ0FBQyxDQUFBLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDL0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0tBQ2xEOzs7OztJQUNELE9BQU8sQ0FBQyxLQUFLOztRQUVYLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCOzs7Ozs7O0lBRUQsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUV4QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDaEIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO2FBQ3RCLENBQUMsQ0FBQztTQUNKO0tBQ0Y7OztZQTNHRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIseXpHQUFrRDs7YUFFbkQ7Ozt3QkFJRSxLQUFLLFNBQUMsV0FBVzt1QkFHakIsS0FBSyxTQUFDLFVBQVU7bUNBR2hCLEtBQUssU0FBQyxzQkFBc0I7b0NBRzVCLEtBQUssU0FBQyx1QkFBdUI7cUJBRzdCLEtBQUssU0FBQyxRQUFRO21CQUdkLEtBQUssU0FBQyxNQUFNO29CQUdaLEtBQUssU0FBQyxPQUFPO3lCQUdiLEtBQUssU0FBQyxZQUFZOzJCQUdsQixLQUFLLFNBQUMsY0FBYzs4QkFHcEIsS0FBSyxTQUFDLGlCQUFpQjsrQkFHdkIsS0FBSyxTQUFDLGtCQUFrQjtzQkFHeEIsTUFBTSxTQUFDLFNBQVM7dUJBR2hCLE1BQU0sU0FBQyxVQUFVO3VCQUdqQixNQUFNLFNBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEEgY29tcGFyaXNpb24gdHJlZSB3aWxsIGxheW91dCBlYWNoIGF0dHJpYnV0ZSBvZiBhIGpzb24gZGVlcCB0aHJvdWdoIGl0cyBoZWlyYXJjaHkgd2l0aCBnaXZlbiB2aXN1YWwgcXVldWVzXHJcbiAqIHRoYXQgcmVwcmVzZW50cyBhIGRlbGV0aW9uLCBhZGl0aW9uLCBvciBjaGFuZ2Ugb2YgYXR0cmlidXRlIGZyb20gdGhlIG90aGVyIHRyZWUuIFRoZSBzdGF0dXMgb2YgZWFjaCBub2RlIGlzIFxyXG4gKiBldmFsdWF0ZWQgYnkgdGhlIHBhcmVudCBjb21wYXJpc2lvbiB0b29sLlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7RGlmZmVyZW50aWF0ZU5vZGVTdGF0dXN9IGZyb20gJy4uL2ludGVyZmFjZXMvZGlmZmVyZW50aWF0ZS5pbnRlcmZhY2VzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZGlmZmVyZW50aWF0ZS10cmVlJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGlmZmVyZW50aWF0ZS10cmVlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kaWZmZXJlbnRpYXRlLXRyZWUuY29tcG9uZW50LnNjc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIERpZmZlcmVudGlhdGVUcmVlIGltcGxlbWVudHMgT25Jbml0e1xyXG4gIGRlcHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcImNvbGxhcHNlZFwiKVxyXG4gIGNvbGxhcHNlZCA9IHRydWU7XHJcblxyXG4gIEBJbnB1dChcImNoaWxkcmVuXCIpXHJcbiAgY2hpbGRyZW47XHJcblxyXG4gIEBJbnB1dChcInNob3dMZWZ0QWN0aW9uQnV0dG9uXCIpXHJcbiAgc2hvd0xlZnRBY3Rpb25CdXR0b24gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KFwic2hvd1JpZ2h0QWN0aW9uQnV0dG9uXCIpXHJcbiAgc2hvd1JpZ2h0QWN0aW9uQnV0dG9uID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcInN0YXR1c1wiKVxyXG4gIHN0YXR1cyA9IDE7XHJcblxyXG4gIEBJbnB1dChcInNpZGVcIilcclxuICBzaWRlID0gXCJcIjtcclxuXHJcbiAgQElucHV0KFwibGV2ZWxcIilcclxuICBsZXZlbCA9IFwiMFwiO1xyXG5cclxuICBASW5wdXQoXCJvYmplY3RQYXRoXCIpXHJcbiAgb2JqZWN0UGF0aCA9IFwiXCI7XHJcblxyXG4gIEBJbnB1dChcImNhdGVnb3JpemVCeVwiKVxyXG4gIGNhdGVnb3JpemVCeTogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJsZWZ0U2lkZVRvb2xUaXBcIilcclxuICBsZWZ0U2lkZVRvb2xUaXAgPSBcInRha2UgbGVmdCBzaWRlXCI7XHJcblxyXG4gIEBJbnB1dChcInJpZ2h0U2lkZVRvb2xUaXBcIilcclxuICByaWdodFNpZGVUb29sVGlwID0gXCJ0YWtlIHJpZ2h0IHNpZGVcIjtcclxuXHJcbiAgQE91dHB1dChcIm9uaG92ZXJcIilcclxuICBvbmhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25yZXZlcnRcIilcclxuICBvbnJldmVydCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9uZXhwYW5kXCIpXHJcbiAgb25leHBhbmQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5kZXB0aCA9IHBhcnNlSW50KHRoaXMubGV2ZWwpO1xyXG4gIH1cclxuXHJcbiAgYnVibGV1cChldmVudCkge1xyXG4gICAgZXZlbnQuc2lkZSA9IHRoaXMuc2lkZTtcclxuICAgIHRoaXMub25ob3Zlci5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIGtleXVwKGV2ZW50KSB7XHJcbiAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICBpZiAoY29kZSA9PT0gMTMpIHtcclxuICAgICAgZXZlbnQudGFyZ2V0LmNsaWNrKCk7XHJcblx0XHR9XHJcbiAgfVxyXG5cclxuICBjaGFuZ0NvdW50ZXIoKSB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgdGhpcy5jaGlsZHJlbi5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgIGlmKGl0ZW0uc3RhdHVzICE9PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0KSB7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBjb3VudDtcclxuICB9XHJcblxyXG4gIGV4cGFuZChldmVudCkge1xyXG4gICAgdGhpcy5vbmV4cGFuZC5lbWl0KCB0aGlzLm9iamVjdFBhdGggKTtcclxuICB9XHJcbiAgYXV0b0V4cGFuZChldmVudCkge1xyXG4gICAgdGhpcy5vbmV4cGFuZC5lbWl0KGV2ZW50KTtcclxuICB9XHJcbiAgYWR2YW5jZVRvUmlnaHRTaWRlKGNoaWxkKSB7XHJcbiAgICBjaGlsZC5wYXRoID0gdGhpcy5vYmplY3RQYXRoICsgKHRoaXMub2JqZWN0UGF0aC5sZW5ndGggPyAnLCc6JycpICsgY2hpbGQuaW5kZXg7XHJcbiAgICB0aGlzLm9ucmV2ZXJ0LmVtaXQoe3R5cGU6XCJhZHZhbmNlXCIsIG5vZGU6IGNoaWxkfSk7XHJcbiAgfVxyXG4gIGFkdmFuY2VUb0xlZnRTaWRlKGNoaWxkKSB7XHJcbiAgICBjaGlsZC5wYXRoID0gdGhpcy5vYmplY3RQYXRoICsgKHRoaXMub2JqZWN0UGF0aC5sZW5ndGggPyAnLCc6JycpICsgY2hpbGQuaW5kZXg7XHJcbiAgICB0aGlzLm9ucmV2ZXJ0LmVtaXQoe3R5cGU6XCJyZXZlcnRcIiwgbm9kZTogY2hpbGR9KTtcclxuICB9XHJcbiAgYWR2YW5jZShldmVudCkge1xyXG4gICAgLy8gYnViYmxlIHVwIHRoZSB1bmRvIGV2ZW50LlxyXG4gICAgdGhpcy5vbnJldmVydC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIG1vdXNlT3ZlcmVkKGV2ZW50LCBmbGFnLCBpKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlmICh0aGlzLmRlcHRoID09PSAyKSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5vbmhvdmVyLmVtaXQoe1xyXG4gICAgICAgIGhvdmVyOiBmbGFnLFxyXG4gICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgIHBhdGg6IHRoaXMub2JqZWN0UGF0aFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19