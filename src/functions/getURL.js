export const getFileURL = (path) => {
    return new URL(`../assets/files/${path}`, import.meta.url).href
}
export const getImageWebpURL = (path, width) => {
    return new URL(`../assets/images/${path}?w=${width}&format=webp`, import.meta.url).href
}
export const getImageURL = (path) => {
    if (document.createElement('canvas').toDataURL('image/webp', 0.5).indexOf('data:image/webp') === 0) {
        return new URL(`../assets/images/${path}?w=${width}&format=webp`, import.meta.url).href
    } else {
        return new URL(`../assets/images/${path}?w=${width}`, import.meta.url).href
    }
}
export const getVideoURL = (path) => {
    return new URL(`../assets/video/${path}`, import.meta.url).href
}