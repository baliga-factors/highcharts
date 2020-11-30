/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../Core/Color/ColorType';
import type LinePoint from './Line/LinePoint';
import type LinePointOptions from './Line/LinePointOptions';
import type LineSeriesOptions from './Line/LineSeriesOptions';
import type {
    PointOptions,
    PointShortOptions
} from '../Core/Series/PointOptions';
import type RadialAxis from '../Core/Axis/RadialAxis';
import type { SeriesStatesOptions } from '../Core/Series/SeriesOptions';
import type { StatesOptionsKey } from '../Core/Series/StatesOptions';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import BaseSeries from '../Core/Series/Series.js';
const {
    seriesTypes: {
        line: LineSeries
    }
} = BaseSeries;
import H from '../Core/Globals.js';
const { TrackerMixin, noop } = H;
import palette from '../Core/Color/Palette.js';
import U from '../Core/Utilities.js';
const {
    clamp,
    isNumber,
    extend,
    merge,
    pick,
    pInt
} = U;


/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        angular?: boolean;
    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        fixedBox?: boolean;
        forceDL?: boolean;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class GaugePoint extends LinePoint {
            public dial?: SVGElement;
            public option: GaugePointOptions;
            public series: GaugeSeries;
            public shapeArgs: SVGAttributes;
            public setState(state?: string): void;
        }
        class GaugeSeries extends LineSeries {
            public angular: boolean;
            public data: Array<GaugePoint>;
            public drawTracker: TrackerMixin['drawTrackerPoint'];
            public fixedBox: boolean;
            public forceDL: boolean;
            public options: GaugeSeriesOptions;
            public pointClass: typeof GaugePoint;
            public points: Array<GaugePoint>;
            public yAxis: RadialAxis;
            public animate(init?: boolean): void;
            public drawPoints(): void;
            public hasData(): boolean;
            public render(): void;
            public setData(
                data: Array<(PointOptions|PointShortOptions)>,
                redraw?: boolean
            ): void;
            public translate(): void;
        }
        interface GaugePointOptions extends LinePointOptions {
        }
        interface GaugeSeriesDialOptions {
            backgroundColor?: ColorType;
            baseLength?: string;
            baseWidth?: number;
            borderColor?: ColorType;
            borderWidth?: number;
            path?: SVGPath;
            radius?: string;
            rearLength?: string;
            topWidth?: number;
        }
        interface GaugeSeriesOptions extends LineSeriesOptions {
            dial?: GaugeSeriesDialOptions;
            overshoot?: number;
            pivot?: GaugeSeriesPivotOptions;
            states?: SeriesStatesOptions<GaugeSeries>;
            wrap?: boolean;
        }
        interface GaugeSeriesPivotOptions {
            backgroundColor?: ColorType;
            borderColor?: ColorType;
            borderWidth?: number;
            radius?: number;
        }
    }
}

/* *
 *
 *  Class
 *
 * */

class GaugeSeries extends LineSeries {

    /* *
     *
     *  Static properties
     *
     * */

    public static defaultOptions: Highcharts.GaugeSeriesOptions = merge(LineSeries.defaultOptions,
        {
            /**
             * When this option is `true`, the dial will wrap around the axes.
             * For instance, in a full-range gauge going from 0 to 360, a value
             * of 400 will point to 40\. When `wrap` is `false`, the dial stops
             * at 360.
             *
             * @see [overshoot](#plotOptions.gauge.overshoot)
             *
             * @type      {boolean}
             * @default   true
             * @since     3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.wrap
             */

            /**
             * Data labels for the gauge. For gauges, the data labels are
             * enabled by default and shown in a bordered box below the point.
             *
             * @since   2.3.0
             * @product highcharts
             */
            dataLabels: {
                borderColor: palette.neutralColor20,
                borderRadius: 3,
                borderWidth: 1,
                crop: false,
                defer: false,
                enabled: true,
                verticalAlign: 'top',
                y: 15,
                zIndex: 2
            },

            /**
             * Options for the dial or arrow pointer of the gauge.
             *
             * In styled mode, the dial is styled with the
             * `.highcharts-gauge-series .highcharts-dial` rule.
             *
             * @sample {highcharts} highcharts/css/gauge/
             *         Styled mode
             *
             * @type    {*}
             * @since   2.3.0
             * @product highcharts
             */
            dial: {},

            /**
             * The length of the dial's base part, relative to the total radius
             * or length of the dial.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-dial/
             *         Dial options demonstrated
             *
             * @type      {string}
             * @default   70%
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.dial.baseLength
             */

            /**
             * The pixel width of the base of the gauge dial. The base is the
             * part closest to the pivot, defined by baseLength.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-dial/
             *         Dial options demonstrated
             *
             * @type      {number}
             * @default   3
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.dial.baseWidth
             */

            /**
             * The radius or length of the dial, in percentages relative to the
             * radius of the gauge itself.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-dial/
             *         Dial options demonstrated
             *
             * @type      {string}
             * @default   80%
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.dial.radius
             */

            /**
             * The length of the dial's rear end, the part that extends out on
             * the other side of the pivot. Relative to the dial's length.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-dial/
             *         Dial options demonstrated
             *
             * @type      {string}
             * @default   10%
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.dial.rearLength
             */

            /**
             * The width of the top of the dial, closest to the perimeter. The
             * pivot narrows in from the base to the top.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-dial/
             *         Dial options demonstrated
             *
             * @type      {number}
             * @default   1
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.dial.topWidth
             */

            /**
             * The background or fill color of the gauge's dial.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-dial/
             *         Dial options demonstrated
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @default   #000000
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.dial.backgroundColor
             */

            /**
             * The border color or stroke of the gauge's dial. By default, the
             * borderWidth is 0, so this must be set in addition to a custom
             * border color.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-dial/
             *         Dial options demonstrated
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @default   #cccccc
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.dial.borderColor
             */

            /**
             * The width of the gauge dial border in pixels.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-dial/
             *         Dial options demonstrated
             *
             * @type      {number}
             * @default   0
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.dial.borderWidth
             */

            /**
             * Allow the dial to overshoot the end of the perimeter axis by
             * this many degrees. Say if the gauge axis goes from 0 to 60, a
             * value of 100, or 1000, will show 5 degrees beyond the end of the
             * axis when this option is set to 5.
             *
             * @see [wrap](#plotOptions.gauge.wrap)
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-overshoot/
             *         Allow 5 degrees overshoot
             *
             * @type      {number}
             * @since     3.0.10
             * @product   highcharts
             * @apioption plotOptions.gauge.overshoot
             */

            /**
             * Options for the pivot or the center point of the gauge.
             *
             * In styled mode, the pivot is styled with the
             * `.highcharts-gauge-series .highcharts-pivot` rule.
             *
             * @sample {highcharts} highcharts/css/gauge/
             *         Styled mode
             *
             * @type    {*}
             * @since   2.3.0
             * @product highcharts
             */
            pivot: {},

            /**
             * The pixel radius of the pivot.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
             *         Pivot options demonstrated
             *
             * @type      {number}
             * @default   5
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.pivot.radius
             */

            /**
             * The border or stroke width of the pivot.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
             *         Pivot options demonstrated
             *
             * @type      {number}
             * @default   0
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.pivot.borderWidth
             */

            /**
             * The border or stroke color of the pivot. In able to change this,
             * the borderWidth must also be set to something other than the
             * default 0.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
             *         Pivot options demonstrated
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @default   #cccccc
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.pivot.borderColor
             */

            /**
             * The background color or fill of the pivot.
             *
             * @sample {highcharts} highcharts/plotoptions/gauge-pivot/
             *         Pivot options demonstrated
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @default   #000000
             * @since     2.3.0
             * @product   highcharts
             * @apioption plotOptions.gauge.pivot.backgroundColor
             */

            tooltip: {
                headerFormat: ''
            },

            /**
             * Whether to display this particular series or series type in the
             * legend. Defaults to false for gauge series.
             *
             * @since   2.3.0
             * @product highcharts
             */
            showInLegend: false

            // Prototype members
        } as Highcharts.GaugeSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data = void 0 as any;
    public points = void 0 as any;
    public options: Highcharts.GaugeSeriesOptions = void 0 as any;

    public yAxis: RadialAxis = void 0 as any;
    public pivot?: SVGElement;
    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Calculate paths etc
     * @private
     */
    public translate(): void {

        var series = this,
            yAxis = series.yAxis,
            options = series.options,
            center = yAxis.center;

        series.generatePoints();

        series.points.forEach(function (point: Highcharts.GaugePoint): void {

            var dialOptions: Highcharts.GaugeSeriesDialOptions =
                    merge(options.dial, point.dial) as any,
                radius = (
                    (pInt(pick(dialOptions.radius, '80%')) * center[2]) /
                    200
                ),
                baseLength = (
                    (pInt(pick(dialOptions.baseLength, '70%')) * radius) /
                    100
                ),
                rearLength = (
                    (pInt(pick(dialOptions.rearLength, '10%')) * radius) /
                    100
                ),
                baseWidth = dialOptions.baseWidth || 3,
                topWidth = dialOptions.topWidth || 1,
                overshoot = options.overshoot,
                rotation = yAxis.startAngleRad + (yAxis.translate(
                    point.y as any, null, null, null, true
                ) as any);

            // Handle the wrap and overshoot options
            if (isNumber(overshoot) || options.wrap === false) {
                overshoot = isNumber(overshoot) ?
                    (overshoot / 180 * Math.PI) : 0;
                rotation = clamp(
                    rotation,
                    yAxis.startAngleRad - overshoot,
                    yAxis.endAngleRad + overshoot
                );
            }

            rotation = rotation * 180 / Math.PI;

            point.shapeType = 'path';
            const d: SVGPath = dialOptions.path || [
                ['M', -rearLength, -baseWidth / 2],
                ['L', baseLength, -baseWidth / 2],
                ['L', radius, -topWidth / 2],
                ['L', radius, topWidth / 2],
                ['L', baseLength, baseWidth / 2],
                ['L', -rearLength, baseWidth / 2],
                ['Z']
            ];
            point.shapeArgs = {
                d,
                translateX: center[0],
                translateY: center[1],
                rotation: rotation
            };

            // Positions for data label
            point.plotX = center[0];
            point.plotY = center[1];
        });
    }

    /**
     * Draw the points where each point is one needle
     * @private
     */
    public drawPoints(): void {

        var series = this,
            chart = series.chart,
            center = series.yAxis.center,
            pivot = series.pivot,
            options = series.options,
            pivotOptions = options.pivot,
            renderer = chart.renderer;

        series.points.forEach(function (point: Highcharts.GaugePoint): void {

            var graphic = point.graphic,
                shapeArgs = point.shapeArgs,
                d = shapeArgs.d,
                dialOptions = merge(options.dial, point.dial); // #1233

            if (graphic) {
                graphic.animate(shapeArgs);
                shapeArgs.d = d; // animate alters it
            } else {
                point.graphic =
                    (renderer as any)[point.shapeType as any](shapeArgs)
                        .attr({
                            // required by VML when animation is false
                            rotation: shapeArgs.rotation,
                            zIndex: 1
                        })
                        .addClass('highcharts-dial')
                        .add(series.group);
            }

            // Presentational attributes
            if (!chart.styledMode) {
                (point.graphic as any)[graphic ? 'animate' : 'attr']({
                    stroke: dialOptions.borderColor || 'none',
                    'stroke-width': dialOptions.borderWidth || 0,
                    fill: dialOptions.backgroundColor ||
                        palette.neutralColor100
                });
            }
        });

        // Add or move the pivot
        if (pivot) {
            pivot.animate({ // #1235
                translateX: center[0],
                translateY: center[1]
            });
        } else {
            series.pivot =
                renderer.circle(0, 0, pick((pivotOptions as any).radius, 5))
                    .attr({
                        zIndex: 2
                    })
                    .addClass('highcharts-pivot')
                    .translate(center[0], center[1])
                    .add(series.group);

            // Presentational attributes
            if (!chart.styledMode) {
                series.pivot.attr({
                    'stroke-width': (pivotOptions as any).borderWidth || 0,
                    stroke: (pivotOptions as any).borderColor ||
                        palette.neutralColor20,
                    fill: (pivotOptions as any).backgroundColor ||
                        palette.neutralColor100
                });
            }
        }
    }

    /**
     * Animate the arrow up from startAngle
     * @private
     */
    public animate(init?: boolean): void {
        var series = this;

        if (!init) {
            series.points.forEach(function (
                point: Highcharts.GaugePoint
            ): void {
                var graphic = point.graphic;

                if (graphic) {
                    // start value
                    graphic.attr({
                        rotation: series.yAxis.startAngleRad * 180 / Math.PI
                    });

                    // animate
                    graphic.animate({
                        rotation: point.shapeArgs.rotation
                    }, series.options.animation);
                }
            });
        }
    }

    /**
     * @private
     */
    public render(): void {
        this.group = this.plotGroup(
            'group',
            'series',
            this.visible ? 'visible' : 'hidden',
            this.options.zIndex,
            this.chart.seriesGroup
        );
        LineSeries.prototype.render.call(this);
        this.group.clip(this.chart.clipRect);
    }
    /**
     * Extend the basic setData method by running processData and generatePoints
     * immediately, in order to access the points from the legend.
     * @private
     */
    public setData(
        data: Array<(PointOptions|PointShortOptions)>,
        redraw?: boolean
    ): void {
        LineSeries.prototype.setData.call(this, data, false);
        this.processData();
        this.generatePoints();
        if (pick(redraw, true)) {
            this.chart.redraw();
        }
    }

    /**
     * Define hasData function for non-cartesian series.
     * Returns true if the series has points at all.
     * @private
     */
    public hasData(): boolean {
        return !!this.points.length; // != 0
    }

    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Prototype properties
 *
 * */

extend(GaugeSeries.prototype, {
    // chart.angular will be set to true when a gauge series is present,
    // and this will be used on the axes
    angular: true,
    directTouch: true, // #5063
    drawGraph: noop as any,
    fixedBox: true,
    forceDL: true,
    noSharedTooltip: true,
    trackerGroups: ['group', 'dataLabelsGroup'],
    // If the tracking module is loaded, add the point tracker
    drawTracker: TrackerMixin && TrackerMixin.drawTrackerPoint
});

class GaugePoint extends LineSeries.prototype.pointClass {
    /* eslint-disable valid-jsdoc */

    /**
     * Don't do any hover colors or anything
     * @private
     */
    public setState(state?: StatesOptionsKey): void {
        this.state = state;
    }

    /* eslint-enable valid-jsdoc */
}
GaugeSeries.prototype.pointClass = GaugePoint;

/**
 * Gauges are circular plots displaying one or more values with a dial pointing
 * to values along the perimeter.
 *
 * @sample highcharts/demo/gauge-speedometer/
 *         Gauge chart
 *
 * @extends      plotOptions.line
 * @excluding    animationLimit, boostThreshold, colorAxis, colorKey,
 *               connectEnds, connectNulls, cropThreshold, dashStyle, dragDrop,
 *               findNearestPointBy, getExtremesFromAll, marker, negativeColor,
 *               pointPlacement, shadow, softThreshold, stacking, states, step,
 *               threshold, turboThreshold, xAxis, zoneAxis, zones, dataSorting,
 *               boostBlending
 * @product      highcharts
 * @requires     highcharts-more
 * @optionparent plotOptions.gauge
 */


/* *
 *
 *  Registry
 *
 * */

/**
 * @private
 */
declare module '../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        gauge: typeof Highcharts.GaugeSeries;
    }
}

BaseSeries.registerSeriesType('gauge', GaugeSeries);

/* *
 *
 *  Default export
 *
 * */

export default GaugeSeries;

/**
 * A `gauge` series. If the [type](#series.gauge.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.gauge
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dataParser, dataURL, findNearestPointBy,
 *            getExtremesFromAll, marker, negativeColor, pointPlacement, shadow,
 *            softThreshold, stack, stacking, states, step, threshold,
 *            turboThreshold, zoneAxis, zones, dataSorting, boostBlending
 * @product   highcharts
 * @requires  highcharts-more
 * @apioption series.gauge
 */

/**
 * An array of data points for the series. For the `gauge` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.gauge.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        y: 6,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        y: 8,
 *        name: "Point1",
 *       color: "#FF00FF"
 *    }]
 *    ```
 *
 * The typical gauge only contains a single data value.
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|null|*>}
 * @extends   series.line.data
 * @excluding drilldown, marker, x
 * @product   highcharts
 * @apioption series.gauge.data
 */

''; // adds the doclets above in the transpiled file
