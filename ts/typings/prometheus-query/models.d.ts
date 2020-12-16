// These typings were generated by the SLOC team from the source code of https://github.com/samber/prometheus-query-js v2.1.4
// `npx typescript ./src/index.js --declaration --allowJs --emitDeclarationOnly --outDir types`
export class ResponseType {
    static get MATRIX(): string;
    static get VECTOR(): string;
    static get SCALAR(): string;
    static get STRING(): string;
}
export class Metric {
    static fromJSON(obj: any): Metric;
    constructor(name: any, labels: any);
    name: any;
    labels: any;
    toString(): string;
}
export class SampleValue {
    static fromJSON(arr: any): SampleValue;
    constructor(unixTime: any, sampleValue: any);
    time: any;
    value: number;
    toString(): string;
}
export class RangeVector {
    static fromJSON(obj: any): RangeVector;
    constructor(metric: any, values: any);
    metric: any;
    values: any;
}
export class InstantVector {
    static fromJSON(obj: any): InstantVector;
    constructor(metric: any, value: any);
    metric: any;
    value: any;
}
export class QueryResult {
    static fromJSON(data: any): QueryResult;
    constructor(resultType: any, result: any);
    resultType: any;
    result: any;
}
export class Target {
    static fromJSON(obj: any): Target;
    constructor(discoveredLabels: any, labels: any, scrapePool: any, scrapeUrl: any, lastError: any, lastScrape: any, lastScrapeDuration: any, health: any);
    discoveredLabels: any;
    labels: any;
    scrapePool: any;
    scrapeUrl: any;
    lastError: any;
    lastScrape: any;
    lastScrapeDuration: any;
    health: any;
}
export class Alert {
    static fromJSON(obj: any): Alert;
    constructor(activeAt: any, annotations: any, labels: any, state: any, value: any);
    activeAt: any;
    annotations: any;
    labels: any;
    state: any;
    value: any;
}
export class Rule {
    static fromJSON(obj: any): Rule;
    constructor(alerts: any, annotations: any, duration: any, health: any, labels: any, name: any, query: any, type: any);
    alerts: any;
    annotations: any;
    duration: any;
    health: any;
    labels: any;
    name: any;
    query: any;
    type: any;
}
export class RuleGroup {
    static fromJSON(obj: any): RuleGroup;
    constructor(rules: any, file: any, interval: any, name: any);
    rules: any;
    file: any;
    interval: any;
    name: any;
}
