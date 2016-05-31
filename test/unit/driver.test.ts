/**
 * driver.test
 */

/// <reference path="../../typings/index.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect, proxyquire, sinon} from "../helper";
import {__factory} from "../../lib/driver";


describe("MySQL driver test", function () {

    describe("real", function () {

        it("should correctly configure the factory endpoint", function () {

            expect(__factory).to.be.an("object");

            expect(__factory).to.have.keys([
                "name",
                "factory"
            ]);

            expect(__factory.name).to.be.equal("$mysqlDriver");

            expect(__factory.factory).to.be.an("array")
                .have.length(2);

            expect(__factory.factory[0]).to.be.equal("StoreError");
            expect(__factory.factory[1]).to.be.a("function");

        });

    });

    describe("stubbed", function () {

        beforeEach(function () {

            this.promisification = {};

            this.promisifyAll = (target, opts) => {
                this.promisification.target = target;
                this.promisification.opts = opts;
            };

            this.bluebird = {
                promisifyAll: this.promisifyAll
            };

            this.pool = {
                getConnection: sinon.stub()
            };

            this.mysql = {
                createPool: sinon.stub()
                    .returns(this.pool)
            };

            const driver = proxyquire("../lib/driver", {
                "mysql/lib/Connection": "mysqlConnection",
                bluebird: this.bluebird,
                mysql: this.mysql
            }).__factory.factory[1];

            this.StoreError = sinon.stub();

            this.driver = driver(this.StoreError);

            expect((<any> this.pool).acquire).to.be.undefined;
            expect((<any> this.pool).release).to.be.undefined;

        });

        describe("configuration", function () {

            it("should configure with default options", function () {

                expect(this.driver()).to.be.equal(this.pool);

                expect((<any> this.pool).acquire).to.be.a("function");
                expect((<any> this.pool).release).to.be.a("function");

                expect(this.mysql.createPool).to.be.calledOnce
                    .calledWithExactly({});

            });

            it("should configure with set options", function () {

                expect(this.driver({
                    host: "dbhost",
                    user: "username",
                    password: "password",
                    database: "dbName",
                    port: 1234,
                    connectionLimit: 23
                })).to.be.equal(this.pool);

                expect((<any> this.pool).acquire).to.be.a("function");
                expect((<any> this.pool).release).to.be.a("function");

                expect(this.mysql.createPool).to.be.calledOnce
                    .calledWithExactly({
                        host: "dbhost",
                        user: "username",
                        password: "password",
                        database: "dbName",
                        port: 1234,
                        connectionLimit: 23
                    });

            });

        });

        describe("promisification", function () {

            it("should promisify the connection and wrap an error in a StoreError", function () {

                expect(this.promisification).to.have.keys([
                    "target",
                    "opts"
                ]);

                expect(this.promisification.target).to.be.eql([
                    "mysqlConnection"
                ]);

                expect(this.promisification.opts).to.have.keys([
                    "promisifier"
                ]);

                let error = new Error("some error");

                let originalMethod = "original method";
                let promise = (<any> sinon.stub())
                    .rejects(error);
                let promisifier = sinon.stub()
                    .returns(promise);

                return this.promisification.opts.promisifier(originalMethod, promisifier)("arg1", "arg2", "arg3")
                    .catch((err: any) => {

                        expect(err).to.be.instanceof(this.StoreError);

                        expect(this.StoreError).to.be.calledOnce
                            .calledWithExactly(error)
                            .calledWithNew;

                        expect(promise).to.be.calledOnce
                            .calledWithExactly("arg1", "arg2", "arg3");

                        expect(promisifier).to.be.calledOnce
                            .calledWithExactly(originalMethod);

                    });

            });

        });

        describe("#acquire", function () {

            it("should handle an error", function () {

                const err = new Error("store error");
                this.StoreError.returns(err);
                this.pool.getConnection.yields("connection error");
                const cb = sinon.spy();

                const pool = this.driver();

                expect(pool).to.be.equal(this.pool);

                pool.acquire(cb);

                expect(this.pool.getConnection).to.be.calledOnce;

                expect(cb).to.be.calledOnce
                    .calledWithExactly(err, null);

                expect(this.StoreError).to.be.calledOnce
                    .calledWithExactly("connection error");

            });

            it("should return the connection", function () {

                this.pool.getConnection.yields(null, "connection");
                const cb = sinon.spy();

                const pool = this.driver();

                expect(pool).to.be.equal(this.pool);

                pool.acquire(cb);

                expect(this.pool.getConnection).to.be.calledOnce;

                expect(cb).to.be.calledOnce
                    .calledWithExactly(null, "connection");

            });

        });

        describe("#release", function () {

            it("should release the connection", function () {

                const pool = this.driver();

                expect(pool).to.be.equal(this.pool);

                const connection = {
                    release: sinon.spy()
                };

                pool.release(connection);

                expect(connection.release).to.be.calledOnce
                    .calledWithExactly();

            });

        });

    });

});
