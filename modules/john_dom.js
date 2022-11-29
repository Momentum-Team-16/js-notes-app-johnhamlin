export function buildAndAppendElement(
  text,
  parentElement,
  elementType,
  classesArr
) {
  const newElement = document.createElement(elementType);
  if (classesArr) newElement.classList.add(...classesArr);
  newElement.innerText = text;
  if (parentElement) parentElement.appendChild(newElement);
  return newElement;
}
