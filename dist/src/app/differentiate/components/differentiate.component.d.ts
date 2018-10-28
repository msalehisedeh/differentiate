import { OnInit, OnChanges, EventEmitter } from '@angular/core';
export declare class DifferentiateComponent implements OnInit, OnChanges {
    leftSide: any;
    rightSide: any;
    ready: boolean;
    categorizeBy: string[];
    allowRevert: boolean;
    allowAdvance: boolean;
    attributeOrderIsImportant: boolean;
    onlyShowDifferences: boolean;
    leftSideObject: any;
    rightSideObject: any;
    leftSideToolTip: string;
    rightSideToolTip: string;
    namedRootObject: string;
    onrevert: EventEmitter<{}>;
    onadvance: EventEmitter<{}>;
    ondifference: EventEmitter<{}>;
    constructor();
    private generateNodeId();
    private transformNodeToOriginalStructure(node, parent);
    private transformNodeToInternalStruction(node);
    private itemInArray(side, node);
    private leftItemFromRightItem(leftNode, rightNode);
    private compare(leftNode, rightNode);
    private reIndex(list);
    private copyInto(side, item, index, status);
    private setChildrenStatus(list, status);
    private unify(leftSide, rightSide);
    private toInternalStruction(leftNode, rightNode);
    private filterUnchanged(list);
    ngOnChanges(changes: any): void;
    ngOnInit(): void;
    private categorizedName(item);
    private sideCategorizedName(side);
    private init();
    private fireCountDifference();
    private lookupChildOf(side, parentObject, id);
    private performAdvanceToRight(leftSideInfo, rightSideInfo, status, i);
    private performAdvanceToLeft(leftSideInfo, rightSideInfo, status, i);
    advance(event: any): void;
    autoExpand(event: any): void;
    onhover(event: any): void;
}
