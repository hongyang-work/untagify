import Range from "./Range";

class Untagify {

    public raw;
    public parsed;

    constructor(raw: string, ranges: Range[]) {
        this.raw = raw;
        this.parsed = this.transform(raw, ranges);
    }

    transform = (text: string, ranges: Range[]) => {
        this.validateRanges(ranges);
        for (const range of ranges.reverse()) {
            const tag = {
                value: text.substring(range.start + 1, range.end),
                prefix:  text.charAt(range.start)
            };
            text = text.substring(0, range.start) + '[[' + JSON.stringify(tag) + ']]' + text.substring(range.end);
        }
        return text;
    }

    validateRanges = (ranges: Range[]) => {
        ranges.forEach(range => this.validateRange(range));
        const sorted: Range[] = [...ranges].sort((a, b) => b.start - a.start);
        for (let i = 0; i < sorted.length - 1; i++) {
            const range1: Range = sorted[i];
            const range2: Range = sorted[i + 1];
            if (range1.end <= range2.end) throw new Error("Range must not overlap");
        }
    }

    validateRange = (range: Range) => {
        if (range.start >= range.end) throw new Error("Invalid Range: end must be larger than start");
    }
}

export default Untagify;