declare class indentationNode {
    parentNode: indentationNode | null;
    level: number;
    id: number;
    headerLength: number;
    constructor(parentNode: indentationNode | null, level: number, id: number, headerLength: number);
}
declare function getStartingIndex(): number;
declare function getInputString(): string;
declare function showResult(tableOfContents: string): void;
declare function getIndentationLevel(currentNode: indentationNode, currentHeaderLength: number): indentationNode;
declare function genTableOfContents(): void;
