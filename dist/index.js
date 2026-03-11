"use strict";
class indentationNode {
    constructor(parentNode, level, id, headerLength) {
        this.parentNode = parentNode;
        this.level = level;
        this.id = id;
        this.headerLength = headerLength;
    }
}
function getStartingIndex() {
    return (parseInt(document.getElementById("startingIndex").value) || 0);
}
function getInputString() {
    return document.getElementById("input").value;
}
function showResult(tableOfContents) {
    document.getElementById("result").value =
        tableOfContents;
}
function getNextNode(currentNode, currentHeaderLength) {
    let node = currentNode;
    while (node) {
        if (currentHeaderLength === node.headerLength) {
            return new indentationNode(node.parentNode, node.level, node.id + 1, currentHeaderLength);
        }
        if (currentHeaderLength > node.headerLength) {
            return new indentationNode(node, node.level + 1, 1, currentHeaderLength);
        }
        node = node.parentNode;
    }
    return new indentationNode(null, 0, 1, currentHeaderLength);
}
function genTableOfContents() {
    const input = getInputString();
    const headersRegex = /^(#{1,6}) (.*)/gm;
    const titlesCount = new Map();
    const startingIndex = getStartingIndex();
    let node = null;
    let i = 0;
    let tableOfContents = "";
    const matches = input.matchAll(headersRegex);
    for (const match of matches) {
        if (startingIndex <= i) {
            const header = match[1];
            const title = match[2];
            let modifiedTitle = title.toLowerCase().replaceAll(" ", "-");
            const appearenceCount = titlesCount.get(title);
            if (appearenceCount) {
                modifiedTitle += `-${appearenceCount}`;
            }
            titlesCount.set(title, (appearenceCount ?? 0) + 1);
            node =
                node === null
                    ? new indentationNode(null, 0, 1, header.length)
                    : getNextNode(node, header.length);
            tableOfContents += `${" ".repeat(node.level * 3)}${node.id}. [${title}](#${modifiedTitle})\n`;
        }
        i++;
    }
    showResult(tableOfContents);
}
//# sourceMappingURL=index.js.map