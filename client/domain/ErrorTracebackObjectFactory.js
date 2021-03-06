// Copyright 2017 The TIE Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Factory for creating new frontend instances of ErrorTraceback
 * domain objects.
 */

tie.factory('ErrorTracebackObjectFactory', [
  'TracebackCoordinatesObjectFactory',
  function(TracebackCoordinatesObjectFactory) {
    /**
     * ErrorTraceback objects are encapsulate the error message and traceback
     * coordinates for a given Error in a student's submission.
     */

    /**
     * Constructor for ErrorTraceback
     *
     * @param {string} errorMessage string describing the error
     * @param {Array} tracebackCoordinates Array of ErrorTracebackCoordinates
     *    objects describing the sources of each error
     * @constructor
     */
    var ErrorTraceback = function(errorMessage, tracebackCoordinates) {
      /**
       * The error message as a string, e.g. "ZeroDivisionError: integer
       * division or modulo by zero".
       *
       * @type {string}
       * @private
       * */
      this._errorMessage = errorMessage;

      /**
       * A list of ErrorTracebackCoordinates objects. Each object contains a
       * lineNumber and columnNumber (both 1-indexed), representing the
       * locations described in the error trace.
       *
       * @type {Array}
       * @private
       */
      this._tracebackCoordinates = tracebackCoordinates;
    };

    // Instance methods.
    /**
     * Returns the line number in the first error traceback coordinates. This
     * generally means the line in the student code where the error is coming
     * from.
     *
     * @returns {ErrorTraceback}
     * @private
     */
    ErrorTraceback.prototype._getFirstTracebackLine = function() {
      return this._tracebackCoordinates[0].getLineNumber();
    };

    /**
     * Returns the error string from the error message.
     *
     * @returns {string}
     */
    ErrorTraceback.prototype.getErrorString = function() {
      if (this._errorMessage.indexOf('TimeLimitError') === 0) {
        return this._errorMessage;
      }
      return this._errorMessage + ' on line ' + this._getFirstTracebackLine();
    };

    // Static class methods.
    /**
     * Returns an ErrorTraceback object built from the specified params.
     *
     * @param {string} errorMessage string describing error
     * @param {Array} tracebackCoordinates list of ErrorTracebackCoordinates
     *    objects
     * @returns {ErrorTraceback}
     */
    ErrorTraceback.create = function(errorMessage, tracebackCoordinates) {
      return new ErrorTraceback(errorMessage, tracebackCoordinates);
    };

    /**
     * Returns an ErrorTraceback object from a SkulptError
     *
     * @param {SkulptError} skulptError
     * @returns {ErrorTraceback}
     */
    ErrorTraceback.fromSkulptError = function(skulptError) {
      var errorMessage = String(skulptError).slice(
        0, String(skulptError).indexOf(' on line'));
      var tracebackCoordinates = skulptError.traceback.map(function(traceLine) {
        return TracebackCoordinatesObjectFactory.create(
          traceLine.lineno, traceLine.colno);
      });

      return ErrorTraceback.create(errorMessage, tracebackCoordinates);
    };

    return ErrorTraceback;
  }
]);
