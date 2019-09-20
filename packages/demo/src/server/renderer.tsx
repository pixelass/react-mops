import {Head} from "@ngineer/head";
import {toHTML, toHTML5} from "@ngineer/server";
import React from "react";
import {StaticRouter} from "react-router";
import {ServerStyleSheet, StyleSheetManager} from "styled-components";
import {App} from "../app";
import {Document} from "./template";

export const renderSSR = async (request, response) => {
	const isServer = typeof response === "object" && typeof response.send === "function";
	const sheet = new ServerStyleSheet();
	const app = toHTML(
		<StyleSheetManager sheet={sheet.instance}>
			<StaticRouter location={request.url} context={{}}>
				<App />
			</StaticRouter>
		</StyleSheetManager>
	);
	const styles = sheet.getStyleTags();
	const head = Head.renderStatic();
	const html = toHTML5(<Document head={head} styles={styles} app={app} isServer={isServer} />);
	if (isServer) {
		return response.send(html);
	}
	return html;
};
export const serverRenderer = () => renderSSR;
