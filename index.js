function getStartingIndex() {
  return parseInt(document.getElementById("startingIndex").value) || 0;
}

class Node {
  parentNode;
  level;
  id;
  headerLength;
  constructor(parentNode, level, id, headerLength) {
    this.parentNode = parentNode;
    this.level = level;
    this.id = id;
    this.headerLength = headerLength;
  }
}

function getIndentationLevel(currentNode, currentHeaderLength) {
  if (currentHeaderLength === currentNode.headerLength) {
    return new Node(
      currentNode.parentNode,
      currentNode.level,
      currentNode.id + 1,
      currentHeaderLength,
    );
  }

  if (currentHeaderLength > currentNode.headerLength) {
    const newLevel = currentNode.level + 1;
    return new Node(currentNode, newLevel, 1, currentHeaderLength);
  }

  let node = currentNode;
  while (node.parentNode) {
    if (currentHeaderLength === node.headerLength) {
      const newLevel = node.level;
      return new Node(node, newLevel, node.id + 1, currentHeaderLength);
    }

    if (currentHeaderLength > node.headerLength) {
      const newLevel = node.level + 1;
      return new Node(node, newLevel, 1, currentHeaderLength);
    }

    node = node.parentNode;
  }

  return new Node(null, 0, 1, currentHeaderLength);
}

function genTableOfContents() {
  const input = document.getElementById("input").value;
  const headersRegex = /^(#{1,6}) (.*)/gm;
  const titlesCount = new Map();
  const startingIndex = getStartingIndex();
  let node = null;
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

      node =
        i === startingIndex
          ? new Node(null, 0, 1, header.length)
          : getIndentationLevel(node, header.length);

      tableOfContents += `${" ".repeat(node.level * 3)}${node.id}. [${title}](#${modifiedTitle})\n`;
    }

    i++;
  }

  document.getElementById("result").value = tableOfContents;
}
