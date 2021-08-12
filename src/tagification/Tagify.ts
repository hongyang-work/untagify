import Tag from "./Tag";
import Range from "./Range";

class Tagify {

    public readonly raw: string;
    public readonly parsed: string = "";
    public readonly tags: Tag[];

    constructor(raw: string) {
        this.tags = [];
        this.raw = raw;
        this.parsed = this.parse();
    }

    parse = (): string => {
        if (this.raw === null || undefined) return "";

        const dp: number[] = this.locateTags();
        let message: string = '';

        let i: number = this.raw.length - 1;
        while (i >= 0) {
            const subMessage: string = dp[i] > 0 ? this.raw.substring(i - dp[i], i + 1) : '';
            const tag: Tag | null = this.toTag(subMessage, message.length);
            if (tag !== null) this.tags.push(tag);
            message += tag !== null ? tag.reverse() : this.raw.charAt(i);
            i -= tag !== null ? dp[i] + 1 : 1;
        }

        this.invertTagIndex(message.length);
        return message.split('').reverse().join('');
    }

    locateTags = (): number[] => {
        if (this.raw === null || undefined) return [];

        let dp: number[] = [];
        let stack: number[] = [];

        let lastOpen: number = 0;
        for (let i = 0; i < this.raw.length; i++) {
            const curr: string = this.raw.charAt(i);
            const prev4: string = i > 3 ? this.raw.charAt(i - 4) : '\0';
            const prev3: string = i > 2 ? this.raw.charAt(i - 3) : '\0';
            const prev2: string = i > 1 ? this.raw.charAt(i - 2) : '\0';
            const prev1: string = i > 0 ? this.raw.charAt(i - 1) : '\0';
            const next1: string = i < this.raw.length - 1 ? this.raw.charAt(i + 1) : '\0';
            const next2: string = i < this.raw.length - 2 ? this.raw.charAt(i + 2) : '\0';
            const next3: string = i < this.raw.length - 3 ? this.raw.charAt(i + 3) : '\0';

            if (curr === '[' && next1 === '[' && next2 === '{' && next3 === '"')
                stack.push(i);

            if (prev4 !== '\\' && prev3 === '"' && prev2 === '}' && prev1 === ']' && curr === ']') {
                const currOpen: number | undefined = stack.pop();
                dp[i] = currOpen === undefined ? i - lastOpen : i - currOpen;
                lastOpen = dp[i];
            }
        }
        return dp;
    }

    invertTagIndex = (length: number) => {
        for (let tag of this.tags) {
            const range: Range = tag.range;
            const start: number = length - range.end;
            const end: number = length - range.start;
            range.start = start;
            range.end = end;
        }
        this.tags.reverse();
    }

    toTag = (s: string, start: number): Tag | null => {
        if (!this.isValidTag(s)) return null;
        const json: any = this.toJson(s);
        const tagLength: number = (json.prefix + json.value).length;
        const range: Range = new Range(start, start + tagLength);
        return new Tag(json.prefix, json.value, range);
    }

    toJson = (s: string): object => {
        return JSON.parse(s)[0][0];
    }

    isValidTag = (s: string): boolean => {
        if (!this.isValidJson(s)) return false;
        const tag: object = this.toJson(s);
        return tag !== null &&
            'value' in tag &&
            'prefix' in tag &&
            'id' in tag &&
            'type' in tag;
    }

    isValidJson = (s: string): boolean => {
        try {
            return JSON.parse(s) !== null;
        } catch (SyntaxError) {
            return false;
        }
    }

    ranges = (): Range[] => {
        return this.tags.map(tag => tag.range);
    }
}

export default Tagify;
