/**
 * mysqlDriver
 */

/// <reference path="../typings/index.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import {Base} from "steeplejack/lib/base";
const Bluebird = require("bluebird");
import * as mysql from "mysql";
const Connection = require("mysql/lib/Connection");


/* Files */
import {IMysqlConfig} from "./mysqlConfig";
import {ICallback} from "./callback";


/* Name with which to export this module to Steeplejack */
const name = "$mysqlDriver";


/* Configure the module */
const factory = (StoreError: any) => {

    /* Promisify the connection */
    Bluebird.promisifyAll([ Connection ], {
        promisifier: (originalMethod: any, defaultPromisifier: any) => {

            let promisified = defaultPromisifier(originalMethod);

            return function (...args: any[]) {

                return promisified.apply(this, args)
                    .catch((err: Error) => {
                        throw new StoreError(err);
                    });

            };

        }
    });


    return (config: IMysqlConfig = {}) => {

        /* Ensure we always receive an object for the options */
        let mysqlOptions = Base.datatypes.setObject(config.mysql, {});
        let poolOptions = Base.datatypes.setObject(config.poolOptions, {});

        mysqlOptions.connectionLimit = poolOptions.max;

        let pool = mysql.createPool(mysqlOptions);

        /**
         * Acquire
         *
         * This acquires the connection from the
         * pool. This is a thin method so the
         * $poolGrabber can be used.
         *
         * @param {ICallback} cb
         */
        (<any> pool).acquire = (cb: ICallback) => {

            pool.getConnection((err: Error, connection: any) => {

                if (err) {
                    cb(new StoreError(err), null);
                    return;
                }

                cb(null, connection);

            });

        };

        /**
         * Release
         *
         * This released the connection from the
         * pool. This is a thin method so the
         * $poolGrabber can be used.
         *
         * @param {*} connection
         */
        (<any> pool).release = (connection: any) => {
            connection.release();
        };

        return pool;

    };

};


export let __factory = {
    name,
    factory: [
        "StoreError",
        factory
    ]
};
