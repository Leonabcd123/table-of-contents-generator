function getStartingIndex() {
  return parseInt(document.getElementById("startingIndex").value) || 0;
}

class Node {
  parentNode;
  level;
  header;
  constructor(parentNode, level, header) {
    this.parentNode = parentNode;
    this.level = level;
    this.header = header;
  }
}

function getIndentationLevel(currentNode, currentHeader) {
  if (currentHeader.length === currentNode.header.length) {
    return [currentNode, currentNode.level];
  }

  if (currentHeader.length > currentNode.header.length) {
    const newLevel = currentNode.level + 1;
    return [new Node(currentNode, newLevel, currentHeader), newLevel];
  }

  let node = currentNode;
  while (node.parentNode) {
    if (currentHeader.length >= node.header.length) {
      const newLevel = node.level;
      return [new Node(node, newLevel, currentHeader), newLevel];
    }

    node = node.parentNode;
  }

  return [new Node(null, 0, currentHeader), 0];
}

function genTableOfContents() {
  const input = document.getElementById("input").value;
  const headersRegex = /^(#{1,6}) (.*)/gm;
  const titlesCount = new Map();
  const startingIndex = getStartingIndex();
  let node = null;
  let indentationLevel = 0;
  let i = 0;
  let tableOfContents = "";

  const matches = input.matchAll(headersRegex);

  for (match of matches) {
    if (startingIndex <= i) {
      const header = match[1];
      const title = match[2];

      let modifiedTitle = title.toLowerCase().replaceAll(" ", "-");
      const appearenceCount = titlesCount.get(modifiedTitle);

      if (appearenceCount) {
        modifiedTitle += `-${appearenceCount}`;
      }

      titlesCount.set(modifiedTitle, (appearenceCount ?? 0) + 1);

      if (i === startingIndex) {
        node = new Node(null, 0, header);
      }

      [node, indentationLevel] = getIndentationLevel(node, header);

      tableOfContents += `${" ".repeat(indentationLevel * 3)}1. [${title}](#${modifiedTitle})\n`;
    }

    i++;
  }

  document.getElementById("result").value = tableOfContents;
}
