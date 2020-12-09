import { TimeSeriesQuery } from '../query-model';
import { QueryContent } from './query-content';

/** Factory function for creating a new `NativeQueryBuilder`. */
export type NativeQueryBuilderFactoryFn = () => NativeQueryBuilder;

/**
 * Used to assemble the DB specific query for a `TimeSeriesQuery`.
 */
export interface NativeQueryBuilder {

    /**
     * Adds the specified `queryContent` as a new segment to this builder's query.
     */
    addQuery(queryContent: QueryContent): void;

    /**
     * Builds the query for the DB, for which this builder is implemented.
     *
     * @return A new `TimeSeriesQuery` object, whose methods will trigger actual DB operations.
     */
    buildQuery(): TimeSeriesQuery<any>;

}
