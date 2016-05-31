# Steeplejack MySQL

[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]
[![License][license-image]][license-url]

A MySQL strategy for Steeplejack projects

## Usage

This is a very thin wrapper for the MySQL
[library](https://github.com/felixge/node-mysql). It configures a pooled instance of the MySQL
driver, promisified using [Bluebird](http://bluebirdjs.com)

This configures a Steeplejack injectable module called `$mysqlDriver`.

```javascript
// Configure a factory dependency
export const __factory = {
    name: "$mysqlResource",
    factory: ($mysqlDriver) => {

        const config = {}

        return $mongodbDriver(config);

    }
};
```

The `config` accepts any of the [Pool Options](https://github.com/felixge/node-mysql#pool-options)

## Dependencies

This requires an object called `StoreError` to be registered to the Dependency Injector. You can either create your own
or use the [Steeplejack Errors](https://www.npmjs.com/package/steeplejack-errors) package


[node-version-image]: https://img.shields.io/badge/node.js-%3E%3D_0.10-brightgreen.svg?style=flat
[travis-image]: https://img.shields.io/travis/riggerthegeek/steeplejack-mysql.svg?style=flat
[dependencies-image]: http://img.shields.io/david/riggerthegeek/steeplejack-mysql.svg?style=flat
[dev-dependencies-image]: http://img.shields.io/david/dev/riggerthegeek/steeplejack-mysql.svg?style=flat
[license-image]: http://img.shields.io/:license-MIT-green.svg?style=flat

[node-version-url]: http://nodejs.org/download/
[travis-url]: https://travis-ci.org/riggerthegeek/steeplejack-mysql
[dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack-mysql
[dev-dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack-mysql#info=devDependencies&view=table
[license-url]: https://raw.githubusercontent.com/riggerthegeek/steeplejack-mysql/master/LICENSE
