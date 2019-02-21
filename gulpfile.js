"use strict";

const path 			= require( 'path' );
const fs 			= require( 'fs-extra' );

const glob 			= require( 'glob' );
const gulp       	= require( 'gulp' );
const bS 			= require( 'browser-sync' ).create();
const mjml   		= require( 'mjml' );
const htmlbeautify 	= require( 'gulp-html-beautify' );

const pkg 			= require( path.resolve( __dirname, './package.json' ) );
const { index, errors, pretty, src, dist, utf } = pkg.app;

gulp.task( 'htmlbeautify', ( done ) => {

	gulp.src( `${ src }/*.mjml` )
	  .pipe( htmlbeautify( { useConfig: true } ) )
	  .pipe( gulp.dest( `${ src }` ) );

	done();

});

gulp.task( 'serve', ( done ) => {

    bS.init({
        server: dist,
        index: index.replace( / /g, '_' )
    });

    gulp.watch( [ `${ src }*.mjml` ], gulp.series( 'mjml' ) );

    done();
});

gulp.task( 'mjml', ( done ) => {

	fs.removeSync( dist );
	fs.removeSync( errors );
	fs.ensureDirSync( path.join( __dirname, errors ) );

	glob( path.join( __dirname, `${ src }/*.mjml`), { }, ( err, files ) => {

		const prom = [ ];

		for( let file of files ) {

			prom.push( new Promise( ( resolve, reject ) => {

				fs.ensureDir( path.join( __dirname, dist ) ).then( () => {

					let name = file.split( '/' )[ file.split( '/' ).length - 1 ].split( '.' )[ 0 ].replace( / /g, '_' );
					let html = fs.readFileSync( file, utf );
					let markup = mjml( html );

					fs.writeFileSync( `${ dist }${ name }.html`, markup.html, utf );

					fs.writeFileSync( `${ errors }${ name }-error.json`, JSON.stringify( markup.errors, null, 4 ), utf );

					resolve( 'success' );

				}).catch( ( err ) => {

					reject( err );

				});

			}) );
		}

		Promise.all( prom ).then( ( mess ) => {

			bS.reload();
			done();

		});

	});

});

gulp.task('default', gulp.parallel('serve', 'mjml') );
