const get_images = () => {
    return [ 
        { "name": "clock" }
    ];
}

const get_image_url = (image_id) => {
    return `https://graphicallyspeaking.blob.core.windows.net/images/${image_id}.png`;
}

export { get_images, get_image_url }