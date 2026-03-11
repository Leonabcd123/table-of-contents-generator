function getStartingIndex() {
  return document.getElementById("startingIndex").value || 0;
}

function genTableOfContents() {
  const input = document.getElementById("input").value; 
  const headersRegex = /^(#{1,6}) (.*)/gm;
  const titlesCount = new Map();
  const startingIndex = getStartingIndex();
  let baseLevel = 0;
  let i = 0;
  let tableOfContents = "";
 
  const matches = input.matchAll(headersRegex); 

  for (match of matches) {
   if (startingIndex <= i) {
     if (baseLevel === 0) {
       baseLevel = match[1].length;
     }
   
     let title = match[2].toLowerCase().replaceAll(" ", "-");
     const appearenceCount = titlesCount.get(title);

     if (appearenceCount) {
       title += `-${appearenceCount}`;
     }

     titlesCount.set(title, (appearenceCount ?? 0) + 1);
     const indentationLevel = match[1].length - baseLevel * 3;

     tableOfContents += `${" ".repeat(indentationLevel > 0 ? indentationLevel : 0)}1. [${match[2]}](#${title})\n`;
   }

   i++;
  }; 

  document.getElementById("result").value = tableOfContents;
}
