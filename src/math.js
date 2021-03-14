

function distance2d(pos1, pos2) {
    return Math.sqrt((pos1[0] - pos2[0])**2 + (pos1[1] - pos2[1])**2);
}

function distance3d(pos1, pos2) {
    return Math.sqrt((pos1[2] - pos2[2])**2 + distance2d(pos1, pos2)**2);
}

export {distance3d};
