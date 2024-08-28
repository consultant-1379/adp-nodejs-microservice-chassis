import pmService from '../pmService.js';

/**
 * Example of a custom metric and a gauge use
 *
 * Use this approach to separate metric objects from the business logic
 * and to add additional sideffects (if necessary)
 *
 */
class CustomMetric {
  constructor(resourceType, help) {
    this.resourceType = resourceType;
    this._metricEnabled = pmService.isEnabled();
    if (this._metricEnabled) {
      this._metricName = `${resourceType}_num`;
      this._metric = pmService.createMetric('gauge', {
        name: this._metricName,
        help: help || `Total amount of Chassis resources of ${resourceType} type`,
      });
      this.reset();
    }
  }

  add() {
    if (this._metricEnabled) {
      this._metric.inc();
    }
  }

  remove() {
    if (this._metricEnabled) {
      this._metric.dec();
    }
  }

  /**
   * Set metric value to 0
   */
  reset() {
    if (this._metricEnabled) {
      this._metric.set(0);
    }
  }

  /**
   * Delete metric
   */
  clear() {
    if (this._metricEnabled) {
      pmService.deleteMetric(this._metricName);
    }
  }
}

export default CustomMetric;
