/**
 * The function generates x,y points which are passed to the callback.
 * Each callback passes a new point offset from the previous point .
 * The callback function is called for each object passed in the object_array argument.
 * The developer independently determines the processing of callback arguments.
 * Useful for positioning graphics, arranging columns, rows for given graphic objects
 * @param object_array Array of incoming objects
 * @param elems_per_line Number of points in X
 * @param start_x Starting coordinate X of the first object
 * @param start_y Starting coordinate Y of the first object
 * @param space_x Distance between points X
 * @param space_y Distance between points Y
 * @param callback Callback called for each object, to set coordinates or other action
 */
export function grid_util<T>(
    object_array: T[] = [],
    elems_per_line: number,
    start_x: number,
    start_y: number,
    space_x: number,
    space_y: number,
    anchor_x = 0,
    anchor_y = 0,
    /**
     * @param value Object from input array
     * @param point_x Calculated X coordinate
     * @param point_y Calculated Y coordinate
     * @param index Index of the current object in the array
     */
    callback: (value: T, point_x: number, point_y: number, index: number) => void
) {
    for (let i = 0, total_elems = object_array.length; total_elems > i; i++) {
        const x = i % elems_per_line;
        const y = (i / elems_per_line) | 0;
        const total_elems_at_line = Math.min(elems_per_line, total_elems - y * elems_per_line);
        const x_offset = x + (elems_per_line - total_elems_at_line) / 2;
        const shift_x = (total_elems_at_line - 1) * space_x * anchor_x;

        const shift_y = (elems_per_line - 1) * space_y * anchor_y;

        const point_x = start_x - shift_x + space_x * x_offset;
        const point_y = start_y + space_y * y;

        callback(object_array[i], point_x, point_y, i);
    }
}

export function pad(num: number, size: number) {
    const s = '000000000' + num;
    return s.substring(s.length - size);
}
