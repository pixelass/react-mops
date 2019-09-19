import React from "react";
import {Home, NotFound} from "./pages";

export interface Route {
	component: React.ComponentType<any>;
	location: string;
}

export type Routes = Route[];

export const routes = [
	{
		component: Home,
		location: "/"
	},
	{
		component: NotFound,
		location: "/404"
	}
] as Routes;
