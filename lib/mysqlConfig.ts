/**
 * mysqlConfig
 */

/// <reference path="../typings/index.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export interface IMysqlConfig {
    mysql?: {
        host?: string;
        user?: string;
        password?: string;
        database?: string;
        port?: number;
    };
    poolOptions?: {
        max?: number;
    };
}
