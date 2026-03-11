class indentationNode {
  parentNode: indentationNode | null;
  level: number;
  id: number;
  headerLength: number;
  constructor(
    parentNode: indentationNode | null,
    level: number,
    id: number,
    headerLength: number,
  ) {
    this.parentNode = parentNode;
    this.level = level;
    this.id = id;
    this.headerLength = headerLength;
  }
}

function getStartingIndex(): number {
  return (
    parseInt(
      (document.getElementById("startingIndex") as HTMLInputElement).value,
    ) || 0
  );
}

function getInputString(): string {
  return (document.getElementById("input") as HTMLInputElement).value;
}

function showResult(tableOfContents: string): void {
  (document.getElementById("result") as HTMLInputElement).value =
    tableOfContents;
}

function getNextNode(
  currentNode: indentationNode,
  currentHeaderLength: number,
): indentationNode {
  let node: indentationNode | null = currentNode;
  while (node) {
    if (currentHeaderLength === node.headerLength) {
      return new indentationNode(
        node.parentNode,
        node.level,
        node.id + 1,
        currentHeaderLength,
      );
    }

    if (currentHeaderLength > node.headerLength) {
      return new indentationNode(node, node.level + 1, 1, currentHeaderLength);
    }

    node = node.parentNode;
  }

  return new indentationNode(null, 0, 1, currentHeaderLength);
}

function genTableOfContents(): void {
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
