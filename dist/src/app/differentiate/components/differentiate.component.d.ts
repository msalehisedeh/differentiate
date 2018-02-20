import { OnInit, OnChanges } from '@angular/core';
export declare class DifferentiateComponent implements OnInit, OnChanges {
    leftSide: any;
    rightSide: any;
    leftSideObject: any;
    rightSideObject: any;
    constructor();
    private generateNodeId();
    private transformNodeToInternalStruction(node);
    private itemInArray(side, node);
    private leftItemFromRightItem(leftNode, rightNode);
    private compare(leftNode, rightNode);
    private reIndex(list);
    private copyInto(side, item, index, status);
    private unify(leftSide, rightSide);
    private toInternalStruction(leftNode, rightNode);
    ngOnChanges(changes: any): void;
    ngOnInit(): void;
    onhover(event: any): void;
}
