'use strict';
import H from './Globals.js';
import './Color.js';
import './Utilities.js';
	var color = H.color,
		each = H.each,
		getTZOffset = H.getTZOffset,
		isTouchDevice = H.isTouchDevice,
		merge = H.merge,
		pick = H.pick,
		svg = H.svg,
		win = H.win;
		
/* ****************************************************************************
 * Handle the options                                                         *
 *****************************************************************************/
H.defaultOptions = {
	/*= if (build.classic) { =*/
	colors: '${palette.colors}'.split(' '),
	/*= } =*/
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {
		loading: 'Loading...',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
				'August', 'September', 'October', 'November', 'December'],
		shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		// invalidDate: '',
		decimalPoint: '.',
		numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels
		resetZoom: 'Reset zoom',
		resetZoomTitle: 'Reset zoom level 1:1',
		thousandsSep: ' '
	},
	global: {
		useUTC: true,
		//timezoneOffset: 0,
		/*= if (build.classic) { =*/
		VMLRadialGradientURL: 'http://code.highcharts.com@product.cdnpath@/@product.version@/gfx/vml-radial-gradient.png'
		/*= } =*/
	},
	chart: {
		//animation: true,
		//alignTicks: false,
		//reflow: true,
		//className: null,
		//events: { load, selection },
		//margin: [null],
		//marginTop: null,
		//marginRight: null,
		//marginBottom: null,
		//marginLeft: null,
		borderRadius: 0,
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		spacing: [10, 10, 15, 10],
		//spacingTop: 10,
		//spacingRight: 10,
		//spacingBottom: 15,
		//spacingLeft: 10,
		//zoomType: ''
		resetZoomButton: {
			theme: {
				zIndex: 20
			},
			position: {
				align: 'right',
				x: -10,
				//verticalAlign: 'top',
				y: 10
			}
			// relativeTo: 'plot'
		},
		width: null,
		height: null,
		
		/*= if (build.classic) { =*/
		borderColor: '${palette.chartBorderColor}',
		//borderWidth: 0,
		//style: {
		//	fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
		//	fontSize: '12px'
		//},
		backgroundColor: '${palette.backgroundColor}',
		//plotBackgroundColor: null,
		plotBorderColor: '${palette.plotBorderColor}'
		//plotBorderWidth: 0,
		//plotShadow: false,
		/*= } =*/
	},
	/*= if (!build.classic) { =*/
	defs: { // docs
		dropShadow: { // used by tooltip
			tagName: 'filter',
			id: 'drop-shadow',
			opacity: 0.5,
			children: [{
				tagName: 'feGaussianBlur',
				in: 'SourceAlpha',
				stdDeviation: 1
			}, {
				tagName: 'feOffset',
				dx: 1,
				dy: 1
			}, {
				tagName: 'feComponentTransfer',
				children: [{
					tagName: 'feFuncA',
					type: 'linear',
					slope: 0.3
				}]
			}, {
				tagName: 'feMerge',
				children: [{
					tagName: 'feMergeNode'
				}, {
					tagName: 'feMergeNode',
					in: 'SourceGraphic'
				}]
			}]
		},
		style: {
			tagName: 'style',
			textContent: '.highcharts-tooltip{' +
				'filter:url(#drop-shadow)' +
			'}'
		}
	},
	/*= } =*/
	title: {
		text: 'Chart title',
		align: 'center',
		// floating: false,
		margin: 15,
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		/*= if (build.classic) { =*/
		style: {
			color: '${palette.titleColor}',
			fontSize: '18px'
		},
		/*= } =*/
		widthAdjust: -44

	},
	subtitle: {
		text: '',
		align: 'center',
		// floating: false
		// x: 0,
		// verticalAlign: 'top',
		// y: null,
		/*= if (build.classic) { =*/
		style: {
			color: '${palette.subtitleColor}'
		},
		/*= } =*/
		widthAdjust: -44
	},

	plotOptions: {},
	labels: {
		//items: [],
		style: {
			//font: defaultFont,
			position: 'absolute',
			color: '${palette.textColor}'
		}
	},
	legend: {
		enabled: true,
		align: 'center',
		//floating: false,
		layout: 'horizontal',
		labelFormatter: function () {
			return this.name;
		},
		//borderWidth: 0,
		borderColor: '${palette.legendBorderColor}',
		borderRadius: 0,
		navigation: {
			/*= if (build.classic) { =*/
			activeColor: '${palette.legendNavActiveColor}',
			inactiveColor: '${palette.legendNavInactiveColor}'
			/*= } =*/
			// animation: true,
			// arrowSize: 12
			// style: {} // text styles
		},
		// margin: 20,
		// reversed: false,
		// backgroundColor: null,
		/*style: {
			padding: '5px'
		},*/
		/*= if (build.classic) { =*/
		itemStyle: {			
			color: '${palette.legendTextColor}',
			fontSize: '12px',
			fontWeight: 'bold'
		},
		itemHoverStyle: {
			//cursor: 'pointer', removed as of #601
			color: '${palette.legendTextHoverColor}'
		},
		itemHiddenStyle: {
			color: '${palette.legendTextHiddenColor}'
		},
		shadow: false,
		/*= } =*/
		itemCheckboxStyle: {
			position: 'absolute',
			width: '13px', // for IE precision
			height: '13px'
		},
		// itemWidth: undefined,
		// symbolRadius: 0,
		// symbolWidth: 16,
		symbolPadding: 5,
		verticalAlign: 'bottom',
		// width: undefined,
		x: 0,
		y: 0,
		title: {
			//text: null,
			/*= if (build.classic) { =*/
			style: {
				fontWeight: 'bold'
			}
			/*= } =*/
		}			
	},

	loading: {
		// hideDuration: 100,
		// showDuration: 0,
		/*= if (build.classic) { =*/
		labelStyle: {
			fontWeight: 'bold',
			position: 'relative',
			top: '45%'
		},
		style: {
			position: 'absolute',
			backgroundColor: '${palette.backgroundColor}',
			opacity: 0.5,
			textAlign: 'center'
		}
		/*= } =*/
	},

	tooltip: {
		enabled: true,
		animation: svg,
		//crosshairs: null,
		borderRadius: 3,
		dateTimeLabelFormats: {
			millisecond: '%A, %b %e, %H:%M:%S.%L',
			second: '%A, %b %e, %H:%M:%S',
			minute: '%A, %b %e, %H:%M',
			hour: '%A, %b %e, %H:%M',
			day: '%A, %b %e, %Y',
			week: 'Week from %A, %b %e, %Y',
			month: '%B %Y',
			year: '%Y'
		},
		footerFormat: '',
		//formatter: defaultFormatter,
		/* todo: em font-size when finished comparing against HC4
		headerFormat: '<span style="font-size: 0.85em">{point.key}</span><br/>',
		*/
		padding: 8, // docs

		//shape: 'callout',
		//shared: false,
		snap: isTouchDevice ? 25 : 10,
		/*= if (!build.classic) { =*/
		headerFormat: '<span class="highcharts-header">{point.key}</span><br/>',
		pointFormat: '<span class="highcharts-color-{point.colorIndex}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
		/*= } else { =*/
		backgroundColor: color('${palette.tooltipBackgroundColor}').setOpacity(0.85).get(),
		borderWidth: 1,
		headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
		pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
		shadow: true,
		style: {
			color: '${palette.tooltipTextColor}',
			cursor: 'default',
			fontSize: '12px',
			pointerEvents: 'none', // #1686 http://caniuse.com/#feat=pointer-events
			whiteSpace: 'nowrap'
		}
		/*= } =*/
		//xDateFormat: '%A, %b %e, %Y',
		//valueDecimals: null,
		//valuePrefix: '',
		//valueSuffix: ''
	},

	credits: {
		enabled: true,
		href: 'http://www.highcharts.com',
		position: {
			align: 'right',
			x: -10,
			verticalAlign: 'bottom',
			y: -5
		},
		/*= if (build.classic) { =*/
		style: {
			cursor: 'pointer',
			color: '${palette.creditsColor}',
			fontSize: '9px'
		},
		/*= } =*/
		text: 'Highcharts.com'
	}
};



/**
 * Set the time methods globally based on the useUTC option. Time method can be either
 * local time or UTC (default).
 */
function setTimeMethods() {
	var globalOptions = H.defaultOptions.global,
		Date,
		useUTC = globalOptions.useUTC,
		GET = useUTC ? 'getUTC' : 'get',
		SET = useUTC ? 'setUTC' : 'set';

	H.Date = Date = globalOptions.Date || win.Date; // Allow using a different Date class
	Date.hcTimezoneOffset = useUTC && globalOptions.timezoneOffset;
	Date.hcGetTimezoneOffset = useUTC && globalOptions.getTimezoneOffset;
	Date.hcMakeTime = function (year, month, date, hours, minutes, seconds) {
		var d;
		if (useUTC) {
			d = Date.UTC.apply(0, arguments);
			d += getTZOffset(d);
		} else {
			d = new Date(
				year,
				month,
				pick(date, 1),
				pick(hours, 0),
				pick(minutes, 0),
				pick(seconds, 0)
			).getTime();
		}
		return d;
	};
	each(['Minutes', 'Hours', 'Day', 'Date', 'Month', 'FullYear'], function (s) {
		Date['hcGet' + s] = GET + s;
	});
	each(['Milliseconds', 'Seconds', 'Minutes', 'Hours', 'Date', 'Month', 'FullYear'], function (s) {
		Date['hcSet' + s] = SET + s;
	});
}

/**
 * Merge the default options with custom options and return the new options structure
 * @param {Object} options The new custom options
 */
H.setOptions = function (options) {
	
	// Copy in the default options
	H.defaultOptions = merge(true, H.defaultOptions, options);
	
	// Apply UTC
	setTimeMethods();

	return H.defaultOptions;
};

/**
 * Get the updated default options. Until 3.0.7, merely exposing defaultOptions for outside modules
 * wasn't enough because the setOptions method created a new object.
 */
H.getOptions = function () {
	return H.defaultOptions;
};


// Series defaults
H.defaultPlotOptions = H.defaultOptions.plotOptions;

// set the default time methods
setTimeMethods();