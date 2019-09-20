import React from "react";
import {hot} from "react-hot-loader/root";
import {Route, Switch} from "react-router";
import {GlobalStyle} from "./global-style";
import {NotFound} from "./pages";
import {routes} from "./routes";

const AppContent = () => (
	<React.Fragment>
		<GlobalStyle />
		<Switch>
			{routes.map(({component, location}) => (
				<Route key={location} exact={true} path={location} component={component} />
			))}
			<Route component={NotFound} />
		</Switch>
	</React.Fragment>
);
export const App = hot(AppContent);
