import { TotalCost, TotalCostMetric } from '@sloc/common-mappings';
import { ComposedMetricParams, ComposedMetricSource, ComposedMetricSourceFactory, SlocRuntime } from '@sloc/core';
import { KubeCostMetricSource } from './kube-cost-metric-source';

/**
 * Factory for creating `KubeCostMetricSource` instances that supply metrics of type `TotalCostMetric`.
 */
export class KubeCostMetricSourceFactory implements ComposedMetricSourceFactory<TotalCostMetric, TotalCost> {

    readonly metricType = TotalCostMetric.instance;

    readonly metricSourceName = `${TotalCostMetric.instance.metricTypeName}/kube-cost`;

    createSource(params: ComposedMetricParams, slocRuntime: SlocRuntime): ComposedMetricSource<TotalCost> {
        return new KubeCostMetricSource(params, slocRuntime);
    }

}
