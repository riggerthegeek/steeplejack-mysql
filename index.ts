/**
 * MySQL
 *
 * This is a simple wrapper for MySQL to work with
 *
 */

/// <reference path="./typings/index.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import {Plugin} from "steeplejack/lib/plugin";


/* Files */
import * as driver from "./lib/driver";


/* Add the modules to the plugin */
export let mysql = new Plugin([
    driver
]);
