import { useEffect, useState } from "react";

export function useMousePos(): [number, number] {
    const [x, setX] = useState(-1)
    const [y, setY] = useState(-1)

    useEffect(() => {
        function handleMouseMove(this: Window, ev: MouseEvent) {
            setX(ev.x)
            setY(ev.y)
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => window.removeEventListener("mousemove", handleMouseMove)
    });

    return [x, y]
}