/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const DifferentiateNodeType = {
    literal: 1,
    pair: 2,
    json: 3,
    array: 4,
};
export { DifferentiateNodeType };
DifferentiateNodeType[DifferentiateNodeType.literal] = 'literal';
DifferentiateNodeType[DifferentiateNodeType.pair] = 'pair';
DifferentiateNodeType[DifferentiateNodeType.json] = 'json';
DifferentiateNodeType[DifferentiateNodeType.array] = 'array';
/** @enum {number} */
const DifferentiateNodeStatus = {
    default: 1,
    typeChanged: 2,
    nameChanged: 3,
    valueChanged: 4,
    added: 5,
    removed: 6,
};
export { DifferentiateNodeStatus };
DifferentiateNodeStatus[DifferentiateNodeStatus.default] = 'default';
DifferentiateNodeStatus[DifferentiateNodeStatus.typeChanged] = 'typeChanged';
DifferentiateNodeStatus[DifferentiateNodeStatus.nameChanged] = 'nameChanged';
DifferentiateNodeStatus[DifferentiateNodeStatus.valueChanged] = 'valueChanged';
DifferentiateNodeStatus[DifferentiateNodeStatus.added] = 'added';
DifferentiateNodeStatus[DifferentiateNodeStatus.removed] = 'removed';
/**
 * @record
 */
export function DifferentiateNode() { }
/** @type {?} */
DifferentiateNode.prototype.id;
/** @type {?|undefined} */
DifferentiateNode.prototype.counterpart;
/** @type {?} */
DifferentiateNode.prototype.index;
/** @type {?} */
DifferentiateNode.prototype.name;
/** @type {?} */
DifferentiateNode.prototype.altName;
/** @type {?} */
DifferentiateNode.prototype.value;
/** @type {?} */
DifferentiateNode.prototype.parent;
/** @type {?} */
DifferentiateNode.prototype.type;
/** @type {?} */
DifferentiateNode.prototype.children;
/** @type {?} */
DifferentiateNode.prototype.status;
/** @type {?|undefined} */
DifferentiateNode.prototype.isRoot;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS5pbnRlcmZhY2VzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2RpZmZlcmVudGlhdGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2RpZmZlcmVudGlhdGUvaW50ZXJmYWNlcy9kaWZmZXJlbnRpYXRlLmludGVyZmFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBRUUsVUFBVztJQUNYLE9BQVE7SUFDUixPQUFRO0lBQ1IsUUFBUzs7OzRDQUhULE9BQU87NENBQ1AsSUFBSTs0Q0FDSixJQUFJOzRDQUNKLEtBQUs7OztJQUdMLFVBQVc7SUFDWCxjQUFlO0lBQ2YsY0FBZTtJQUNmLGVBQWdCO0lBQ2hCLFFBQVM7SUFDVCxVQUFXOzs7Z0RBTFgsT0FBTztnREFDUCxXQUFXO2dEQUNYLFdBQVc7Z0RBQ1gsWUFBWTtnREFDWixLQUFLO2dEQUNMLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZXhwb3J0IGVudW0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlIHtcclxuICBsaXRlcmFsID0gMSxcclxuICBwYWlyID0gMixcclxuICBqc29uID0gMyxcclxuICBhcnJheSA9IDRcclxufVxyXG5leHBvcnQgZW51bSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cyB7XHJcbiAgZGVmYXVsdCA9IDEsXHJcbiAgdHlwZUNoYW5nZWQgPSAyLFxyXG4gIG5hbWVDaGFuZ2VkID0gMyxcclxuICB2YWx1ZUNoYW5nZWQgPSA0LFxyXG4gIGFkZGVkID0gNSxcclxuICByZW1vdmVkID0gNlxyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgRGlmZmVyZW50aWF0ZU5vZGUge1xyXG4gIGlkOiBudW1iZXIsXHJcbiAgY291bnRlcnBhcnQ/OiBudW1iZXIsXHJcbiAgaW5kZXg6IG51bWJlcixcclxuICBuYW1lOiBzdHJpbmcsXHJcbiAgYWx0TmFtZTogc3RyaW5nLFxyXG4gIHZhbHVlOiBzdHJpbmcsXHJcbiAgcGFyZW50OiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUsXHJcbiAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLFxyXG4gIGNoaWxkcmVuOiBEaWZmZXJlbnRpYXRlTm9kZVtdLFxyXG4gIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMsXHJcbiAgaXNSb290PzogYm9vbGVhblxyXG59XHJcblxyXG4iXX0=