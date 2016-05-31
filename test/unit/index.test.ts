/**
 * index.test
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {Plugin} from "steeplejack/lib/plugin";


/* Files */
import {expect} from "../helper";
import * as driver from "../../lib/driver";
import {mysql} from "../../index";


describe("config test", function () {

    it("should create a plugin", function () {

        expect(mysql).to.be.instanceof(Plugin);

        expect(mysql.modules).to.be.an("array")
            .have.length(1);

        expect(mysql.modules[0]).to.be.equal(driver);

    });

});
