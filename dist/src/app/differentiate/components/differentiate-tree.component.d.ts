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
    onhover: EventEmitter<any>;
    onrevert: EventEmitter<any>;
    onexpand: EventEmitter<any>;
    ngOnInit(): void;
    bubleup(event: any): void;
    keyup(event: any): void;
    changCounter(): number;
    expand(event: any): void;
    autoExpand(event: any): void;
    advanceToRightSide(child: any): void;
    advanceToLeftSide(child: any): void;
    advance(event: any): void;
    mouseOvered(event: any, flag: any, i: any): void;
}
