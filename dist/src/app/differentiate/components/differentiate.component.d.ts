import { OnInit, OnChanges, EventEmitter } from '@angular/core';
export declare class DifferentiateComponent implements OnInit, OnChanges {
    leftSide: any;
    rightSide: any;
    allowRevert: boolean;
    attributeOrderIsImportant: boolean;
    onlyShowDifferences: boolean;
    leftSideObject: any;
    rightSideObject: any;
    onrevert: EventEmitter<{}>;
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
    private lookupChildOf(side, id);
    revert(event: any): void;
    onhover(event: any): void;
}
