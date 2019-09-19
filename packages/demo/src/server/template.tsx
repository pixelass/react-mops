import Parser from "html-react-parser";
import React from "react";

export const Document = (props: any) => (
	<html lang={props.lang} className="no-js">
	<head>
		{props.head.title.toComponents()}
		<meta charSet="utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<link rel="shortcut icon" href="/assets/logo.ico"/>
		{props.head.meta.toComponents()}
		{props.head.link.toComponents()}
		{Parser(props.styles)}
	</head>
	<body>
		<div data-app-root="">{Parser(props.app)}</div>
		{props.isServer && <script src="/main.js"/>}
	</body>
	</html>
);
