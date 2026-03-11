function getStartingIndex() {
  return parseInt(document.getElementById("startingIndex").value) || 0;
}

class Node {
  parentNode;
  level;
  id;
  header;
  constructor(parentNode, level, id, header) {
    this.parentNode = parentNode;
    this.level = level;
    this.id = id;
    this.header = header;
  }
}

function getIndentationLevel(currentNode, currentHeader) {
  if (currentHeader.length === currentNode.header.length) {
    return [
      new Node(
        currentNode.parentNode,
        currentNode.level,
        currentNode.id + 1,
        currentHeader,
      ),
      currentNode.level,
    ];
  }

  if (currentHeader.length > currentNode.header.length) {
    const newLevel = currentNode.level + 1;
    return [new Node(currentNode, newLevel, 1, currentHeader), newLevel];
  }

  let node = currentNode;
  while (node.parentNode) {
    if (currentHeader.length === node.header.length) {
      const newLevel = node.level;
      return [new Node(node, newLevel, node.id + 1, currentHeader), newLevel];
    }

    if (currentHeader.length > node.header.length) {
      const newLevel = node.level + 1;
      return [new Node(node, newLevel, 1, currentHeader), newLevel];
    }

    node = node.parentNode;
  }

  return [new Node(null, 0, 1, currentHeader), 0];
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
        node = new Node(null, 0, 1, header);
      } else {
        [node, indentationLevel] = getIndentationLevel(node, header);
      }

      tableOfContents += `${" ".repeat(indentationLevel * 3)}${node.id}. [${title}](#${modifiedTitle})\n`;
    }

    i++;
  }

  document.getElementById("result").value = tableOfContents;
}
