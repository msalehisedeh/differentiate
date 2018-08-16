import { OnInit, EventEmitter } from '@angular/core';
export declare class DifferentiateTree implements OnInit {
    depth: number;
    children: any;
    showActionButton: boolean;
    status: number;
    side: any;
    level: string;
    onhover: EventEmitter<{}>;
    onrevert: EventEmitter<{}>;
    ngOnInit(): void;
    bubleup(event: any): void;
    keyup(event: any): void;
    undo(child: any): void;
    revert(event: any): void;
    mouseOvered(flag: any, i: any): void;
}
