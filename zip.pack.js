"use strict";

const path = require( 'path' );
const fs = require( 'fs-extra' );
const glob = require( 'glob' );
const zip = require( 'bestzip' );

const pkg = require( path.resolve( __dirname, './package.json' ) );
const { version } = pkg;
const dist = pkg.app.dist;

let { client, collection, htmlSuffix, htmlPrefix, zipName } = pkg.app;

const format = ( name ) => name.replace( / /g, '_' );
const getName = ( name ) => name.split( '/' )[ name.split( '/' ).length - 1 ].split( '.' )[ 0 ];

client = format( client );
collection = format( collection );

zipName = eval( zipName );
htmlSuffix = eval( htmlSuffix );
htmlPrefix = eval( htmlPrefix );

const getHTMLName = ( name )=> `${ htmlPrefix }${ name }${ htmlSuffix }.html`;

fs.removeSync( `${ dist }packed` );

fs.ensureDir( path.join( __dirname, `${ dist }packed` ) ).then( () => {

	glob( path.join( __dirname, `${ dist }*.html` ), { }, ( err, files ) => {

		for( let file of files ) {

			let name = getName( file );

			fs.copySync( file, `${ dist }packed/${ getHTMLName( name ) }` );

		}

		zip({

			source: '*',
			destination: `${ zipName }.zip`,
			cwd: path.join( __dirname, `${ dist }packed` )

		}).then( () => {

			//yay!

		}).catch( ( err ) => {

			console.error( err.stack );

		});

	});

});