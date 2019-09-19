import {createElement} from "react";
import {hydrate} from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {App} from "./app";

const appRoot = document.querySelector("[data-app-root]");
const {classList} = document.documentElement;
classList.remove("no-js");
classList.add("js");

hydrate(createElement(BrowserRouter, null, createElement(App)), appRoot);
