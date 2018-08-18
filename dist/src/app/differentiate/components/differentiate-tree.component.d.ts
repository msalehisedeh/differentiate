import { OnInit, EventEmitter } from '@angular/core';
export declare class DifferentiateTree implements OnInit {
    depth: number;
    children: any;
    showLeftActionButton: boolean;
    showRightActionButton: boolean;
    status: number;
    side: any;
    level: string;
    onhover: EventEmitter<{}>;
    onrevert: EventEmitter<{}>;
    ngOnInit(): void;
    bubleup(event: any): void;
    keyup(event: any): void;
    advanceToRightSide(child: any): void;
    advanceToLeftSide(child: any): void;
    advance(event: any): void;
    mouseOvered(flag: any, i: any): void;
}
