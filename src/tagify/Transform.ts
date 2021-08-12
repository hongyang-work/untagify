import Range from "./Range";

export const transform = (text: string, ranges: Range[]) => {
    validateRanges(ranges);
    for (const range of ranges.reverse()) {
        const tag = {
            value: text.substring(range.start + 1, range.end),
            prefix:  text.charAt(range.start)
        };
        text = text.substring(0, range.start) + '[[' + JSON.stringify(tag) + ']]' + text.substring(range.end);
    }
    return text;
}

export const validateRanges = (ranges: Range[]) => {
    ranges.forEach(range => validateRange(range));
    const sorted: Range[] = [...ranges].sort((a, b) => b.start - a.start);
    for (let i = 0; i < sorted.length - 1; i++) {
        const range1: Range = sorted[i];
        const range2: Range = sorted[i + 1];
        if (range1.end <= range2.end) throw new Error("Range must not overlap");
    }
}

export const validateRange = (range: Range) => {
    if (range.start >= range.end) throw new Error("Invalid Range: end must be larger than start");
}