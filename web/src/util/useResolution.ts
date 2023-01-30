import { useState, useEffect } from "react";

export function useResolution() {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    
    useEffect(() => {
        function handleResize(this: Window, ev: UIEvent) {
            setHeight(window.innerHeight);
            setWidth(window.innerWidth);
        }
        
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    });

    return [width, height]
}