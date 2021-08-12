import Range from "./Range";

class Tag {
    public id?: string
    public prefix: string
    public value: string
    public type?: string
    public range: Range

    constructor(prefix: string,
                value: string,
                range: Range) {
        this.prefix = prefix;
        this.value = value;
        this.range = range;
    }

    reverse = (): string => {
        return (this.prefix + this.value).split("").reverse().join("");
    }
}

export default Tag;