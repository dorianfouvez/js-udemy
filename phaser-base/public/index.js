"use strict";
import {setPolygon, playPolygon} from "./utils/animation.js";
import {setDateTime} from "./utils/layout.js";
import {Router} from "./Components/Router.js";
import Navbar from "./Components/Navbar.js";

setDateTime();
setPolygon();
playPolygon();

Navbar();

Router();