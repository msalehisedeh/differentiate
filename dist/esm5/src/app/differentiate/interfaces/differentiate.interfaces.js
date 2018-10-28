/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
var DifferentiateNodeType = {
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
var DifferentiateNodeStatus = {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS5pbnRlcmZhY2VzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZGlmZmVyZW50aWF0ZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZGlmZmVyZW50aWF0ZS9pbnRlcmZhY2VzL2RpZmZlcmVudGlhdGUuaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFFRSxVQUFXO0lBQ1gsT0FBUTtJQUNSLE9BQVE7SUFDUixRQUFTOzs7NENBSFQsT0FBTzs0Q0FDUCxJQUFJOzRDQUNKLElBQUk7NENBQ0osS0FBSzs7O0lBR0wsVUFBVztJQUNYLGNBQWU7SUFDZixjQUFlO0lBQ2YsZUFBZ0I7SUFDaEIsUUFBUztJQUNULFVBQVc7OztnREFMWCxPQUFPO2dEQUNQLFdBQVc7Z0RBQ1gsV0FBVztnREFDWCxZQUFZO2dEQUNaLEtBQUs7Z0RBQ0wsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5leHBvcnQgZW51bSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUge1xyXG4gIGxpdGVyYWwgPSAxLFxyXG4gIHBhaXIgPSAyLFxyXG4gIGpzb24gPSAzLFxyXG4gIGFycmF5ID0gNFxyXG59XHJcbmV4cG9ydCBlbnVtIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzIHtcclxuICBkZWZhdWx0ID0gMSxcclxuICB0eXBlQ2hhbmdlZCA9IDIsXHJcbiAgbmFtZUNoYW5nZWQgPSAzLFxyXG4gIHZhbHVlQ2hhbmdlZCA9IDQsXHJcbiAgYWRkZWQgPSA1LFxyXG4gIHJlbW92ZWQgPSA2XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBEaWZmZXJlbnRpYXRlTm9kZSB7XHJcbiAgaWQ6IG51bWJlcixcclxuICBjb3VudGVycGFydD86IG51bWJlcixcclxuICBpbmRleDogbnVtYmVyLFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBhbHROYW1lOiBzdHJpbmcsXHJcbiAgdmFsdWU6IHN0cmluZyxcclxuICBwYXJlbnQ6IERpZmZlcmVudGlhdGVOb2RlVHlwZSxcclxuICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUsXHJcbiAgY2hpbGRyZW46IERpZmZlcmVudGlhdGVOb2RlW10sXHJcbiAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cyxcclxuICBpc1Jvb3Q/OiBib29sZWFuXHJcbn1cclxuXHJcbiJdfQ==