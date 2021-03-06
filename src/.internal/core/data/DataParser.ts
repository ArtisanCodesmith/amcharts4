/**
 * Data parser module.
 */


/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { DateFormatter } from "../formatters/DateFormatter";
import * as $utils from "../utils/Utils";
import * as $type from "../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines common options for all data parsers.
 */
export interface IDataParserOptions {

	/**
	 * Empty values (e.g. empty strings, `null`, etc.) will be replaced with
	 * this.
	 */
	emptyAs?: any;

	/**
	 * List of fields in data that hold numeric values. Parser will try to
	 * convert the value in those fields to a `number`.
	 */
	numberFields?: string[];

	/**
	 * List of fields in data that need to be treated as Dates, i.e. converted
	 * to `Date` objects from whatever source format they are currently in.
	 */
	dateFields?: string[];

	/**
	 * An instance of [[DateFormatter]] to use when parsing string-based dates.
	 * If it's not set, the parser will create it's own instance of
	 * [[DateFormatter]], should any date parsing required. (`dateFields` is set)
	 *
	 * Unless `dateFormat` is set in parser options, the parser will try to look
	 * for `dateFormat` in `dateFormatter`.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-date-time/#Parsing_Dates} Tutorial on date parsing
	 */
	dateFormatter?: DateFormatter;

	/**
	 * Override date format set in `dateFormatter`.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-date-time/#Parsing_Dates} Tutorial on date parsing
	 */
	dateFormat?: string;

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Base class for the data parsers.
 */
export class DataParser {

	/**
	 * Content type, relevant to the specific format.
	 */
	public contentType: string;

	/**
	 * Parser options.
	 *
	 * @see {@link IDataParserOptions} for description of each option
	 */
	public options: IDataParserOptions;

	/**
	 * A "placeholder" function for real parsers to override.
	 *
	 * @ignore Exclude from docs
	 * @param data  Source data
	 * @return Parsed data (empty)
	 */
	public parse(data: string): any {
		return [];
	};

	/**
	 * Checks if there are any numeric fields that need to be converted to
	 * numbers.
	 *
	 * @return Numeric fields?
	 */
	protected get parsableNumbers(): boolean {
		return this.options.numberFields && (this.options.numberFields.length > 0);
	}

	/**
	 * Converts a value to 'number' if it is in `numberFields`.
	 *
	 * @param field  Field name
	 * @param value  Value
	 * @return Parsed or original value
	 */
	protected maybeToNumber(field: string, value: any): any {
		if (this.options.numberFields.indexOf(field) !== -1) {
			return $utils.anyToNumber(value);
		}
		return value;
	}

	/**
	 * Checks if there are any date fields that need to be converted to `Date`
	 * objects.
	 *
	 * @return Date fields?
	 */
	protected get parsableDates(): boolean {
		return this.options.dateFields && (this.options.dateFields.length > 0);
	}

	/**
	 * Converts a value to `Date` if it is in `dateFields`.
	 *
	 * @param field  Field name
	 * @param value  Value
	 * @return Parsed or original value
	 */
	protected maybeToDate(field: string, value: any): any {
		if (this.options.dateFields.indexOf(field) !== -1) {
			return this.options.dateFormatter.parse(value, this.dateFormat);
		}
		return value;
	}

	/**
	 * Replaces empty value with something else.
	 *
	 * @param value  Source value
	 * @return Source value or replacement
	 */
	protected maybeToEmpty(value: any): any {
		if ((!$type.hasValue(value) || value == "") && $type.hasValue(this.options.emptyAs)) {
			return this.options.emptyAs;
		}
		return value;
	}

	/**
	 * [[DateFormatter]] object for date parsing.
	 *
	 * If there was not [[DateFormatter]] supplied in parser options, a new one
	 * is created.
	 *
	 * @return Date formatter
	 * @see {@link DateFormatter}
	 */
	protected get dateFormatter(): DateFormatter {
		if (!this.options.dateFormatter) {
			this.options.dateFormatter = new DateFormatter;
			if (this.options.dateFormat) {
				this.options.dateFormat = this.options.dateFormat;
			}
		}
		return this.options.dateFormatter;
	}

	/**
	 * A date format to use when parsing dates.
	 *
	 * @return Date format
	 * @see {@link DateFormatter}
	 */
	protected get dateFormat(): string {
		return this.options.dateFormat || this.dateFormatter.inputDateFormat;
	}

}
