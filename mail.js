"use strict";

const path = require( 'path' );
const fs = require( 'fs' );

const nodemailer = require( 'nodemailer' );

const pkg = require( path.resolve( __dirname, './package.json' ) );
const { version } = pkg;
const { dist, index, admin, to, from, client, collection, utf } = pkg.app;

const pwd = fs.readFileSync( path.resolve( __dirname, './.pwd' ), utf );
const html = fs.readFileSync( path.resolve( __dirname, `${ dist }${ index.replace( / /g, '_' ) }` ), utf );
const subject = eval( pkg.app.subject );

const mailOptions = {

	from: from,
	to: to,
	subject: subject,
	html: html

};

const transporter = nodemailer.createTransport({

	service: 'gmail',
	auth: {
		user: admin,
		pass: pwd
	}

});

transporter.sendMail( mailOptions, ( err, info ) => {

	if( err ) {
		console.log( err )
	} else {
		console.log( info );
	}

});