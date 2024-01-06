
export enum DifferentiateNodeType {
  literal = 1,
  pair = 2,
  json = 3,
  array = 4
}
export enum DifferentiateNodeStatus {
  extended = 0,
  default = 1,
  typeChanged = 2,
  nameChanged = 3,
  valueChanged = 4,
  added = 5,
  removed = 6
}
export interface DifferentiateNode {
  id: number,
  counterpart?: number,
  index: number,
  name: string,
  altName: string,
  value: string,
  parent: DifferentiateNodeType,
  type: DifferentiateNodeType,
  children: DifferentiateNode[],
  status: DifferentiateNodeStatus,
  isRoot?: boolean
}

export interface StatisticalData {
  time: Date,
  changed: number,
  removed: number,
  added: number
}

