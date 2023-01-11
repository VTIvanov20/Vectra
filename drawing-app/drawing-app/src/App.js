import React, { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, type) {
  let roughElement;
  switch (type) {
    case "line":
        roughElement = generator.line(x1, y1, x2, y2);
        break;
    case "rectangle":
        roughElement = generator.rectangle(x1, y1, x2-x1, y2-y1);
        break;
    case "circle":
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        roughElement = generator.circle(x1, y1, radius);
        break;
    default:
        throw new Error(`Type not recognized: ${type}`);
  }
  return {id, x1, y1, x2, y2, type, roughElement };
}

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const positionWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;
  switch (type) {
    case "line":
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    case "rectangle":
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements
    .map(element => ({ ...element, position: positionWithinElement(x, y, element) }))
    .find(element => element.position !== null);
};

const removeElement = (id, elements) => {
  return elements.filter(element => element.id !== id);
};

const adjustElementCoordinates = element => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const cursorForPosition = position => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null; //should not really get here...
  }
};

const App = () => {
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectionElement] = useState(null);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  const updatedElement = (id, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(id, x1, y1, x2, y2, type);

    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement;
    setElements(elementsCopy);
  };

  const handleMouseDown = event => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if(element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectionElement({ ...element, offsetX, offsetY })
        if(element.position === "inside") {
          setAction("moving");
        } else {
          setAction("drawing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(id, clientX, clientY, clientX, clientY, tool);
      setElements(prevState  => [...prevState, element]);
      setSelectionElement(element);

      setAction("drawing");
    }
    
  };

  const handleMouseMove = event => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element ? cursorForPosition(element.position) : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updatedElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === "moving") {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const nexX1 = clientX - offsetX;
      const nexY1 = clientY - offsetY;
      updatedElement(id, nexX1, nexY1, nexX1 + width, nexY1 + height, type);
    } else if (action === "resizing") {
      const {id, type, position, ...coordinates } = selectedElement;
      const {x1, y1, x2, y2} = resizedCoordinates(clientX, clientY, position, coordinates);
      updatedElement(id, x1, y1, x2, y2, type);
    }
  };

  const handleMouseUp = () => {
    const index = selectedElement.id;
    const { id, type } = elements[index];

    if(action === "drawing" || action === "resizing") {
      const {x1, y1, x2, y2} = adjustElementCoordinates(elements[index]);
      updatedElement(id, x1, y1, x2, y2, type);
    }
    setAction("none");
    setSelectionElement(null);
  };

  const handleRemove = event => {
    //event.target.value will give you the value of the selected radio button
    const elements = removeElement(event.target.value, elements);
    // Update the state with the new elements
    setElements(elements);
  };

  const clearElements = () => {
    setElements([]);
  }  

  return (
    <div>
      <div style={{ position: "fixed"}}>
        <input type="radio" id="selection" checked={tool === "selection"} onChange={() => setTool("selection")}/>
        <label htmlFor="selection">Selection</label>
        <input type="radio" id="line" checked={tool === "line"} onChange={() => setTool("line")}/>
        <label htmlFor="line">Line</label>
        <input type="radio" id="rectangle" checked={tool === "rectangle"} onChange={() => setTool("rectangle")}/>
        <label htmlFor="rectangle">Rectangle</label>
        <input type="radio" id="remove" checked={tool === "remove"} onChange={handleRemove} value={element.id}/>
        <label htmlFor="remove">Remove</label>
        <input type="radio" id="clear" checked={tool === "clear"} onChange={clearElements}/>
        <label htmlFor="remove">Clear</label>
      </div>
      
      <canvas 
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >

      </canvas>
    </div>
  );
};

export default App;