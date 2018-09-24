import { OnInit, EventEmitter } from '@angular/core';
export declare class DifferentiateTree implements OnInit {
    depth: number;
    collapsed: boolean;
    children: any;
    showLeftActionButton: boolean;
    showRightActionButton: boolean;
    status: number;
    side: string;
    level: string;
    objectPath: string;
    categorizeBy: string;
    leftSideToolTip: string;
    rightSideToolTip: string;
    onhover: EventEmitter<{}>;
    onrevert: EventEmitter<{}>;
    onexpand: EventEmitter<{}>;
    ngOnInit(): void;
    bubleup(event: any): void;
    keyup(event: any): void;
    expand(event: any): void;
    autoExpand(event: any): void;
    advanceToRightSide(child: any): void;
    advanceToLeftSide(child: any): void;
    advance(event: any): void;
    mouseOvered(flag: any, i: any): void;
}
