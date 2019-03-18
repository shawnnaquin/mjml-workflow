"use strict";

const path = require( 'path' );
const fs = require( 'fs-extra' );
const glob = require( 'glob' );
const zip = require( 'bestzip' );

const pkg = require( path.resolve( __dirname, './package.json' ) );
const { version } = pkg;
const dist = pkg.app.dist;
const packed = pkg.app.packed;

let { client, collection, htmlSuffix, htmlPrefix, zipName } = pkg.app;

const format = ( name ) => name.replace( / /g, '_' );

/*

/../../Fall_Savings.html -> Fall_Savings

*/
const getName = ( name ) => name.split( '/' )[ name.split( '/' ).length - 1 ].split( '.' )[ 0 ];

// need for eval below
client = format( client );
collection = format( collection );

zipName = eval( zipName );
htmlSuffix = eval( htmlSuffix );
htmlPrefix = eval( htmlPrefix );

// save filename
const getHTMLName = ( name )=> `${ htmlPrefix }${ name }${ htmlSuffix }.html`;

// main func
fs.removeSync( `${ packed }` );

fs.ensureDir( path.join( __dirname, `${ packed }` ) ).then( () => {

	glob( path.join( __dirname, `${ dist }*.html` ), { }, ( err, files ) => {

		for( let file of files ) {

			let name = getName( file );
			fs.copySync( file, `${ packed }${ getHTMLName( name ) }` );

		}

		zip({

			source: '*',
			destination: `${ zipName }.zip`,
			cwd: path.join( __dirname, `${ packed }` )

		}).then( () => {

			//yay!

		}).catch( ( err ) => {

			console.error( err.stack );

		});

	});

});