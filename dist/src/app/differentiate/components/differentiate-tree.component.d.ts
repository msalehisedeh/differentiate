import { OnInit, EventEmitter } from '@angular/core';
export declare class DifferentiateTree implements OnInit {
    depth: number;
    onhover: EventEmitter<{}>;
    children: any;
    side: any;
    level: string;
    ngOnInit(): void;
    bubleup(event: any): void;
    mouseOvered(flag: any, i: any): void;
}
