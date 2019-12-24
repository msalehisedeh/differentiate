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
    onrevert: EventEmitter<any>;
    onadvance: EventEmitter<any>;
    ondifference: EventEmitter<any>;
    constructor();
    private generateNodeId;
    private transformNodeToOriginalStructure;
    private transformNodeToInternalStruction;
    private itemInArray;
    private leftItemFromRightItem;
    private compare;
    private reIndex;
    private copyInto;
    private setChildrenStatus;
    private unify;
    private toInternalStruction;
    private filterUnchanged;
    ngOnChanges(changes: any): void;
    ngOnInit(): void;
    private categorizedName;
    private sideCategorizedName;
    private init;
    private fireCountDifference;
    private lookupChildOf;
    private performAdvanceToRight;
    private performAdvanceToLeft;
    advance(event: any): void;
    autoExpand(event: any): void;
    onhover(event: any): void;
}
