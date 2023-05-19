import { constants } from "./constants";
import {Page} from "./page";
import { ServerRequest } from "./request";

console.log("start");
let r = new ServerRequest({}, constants.SERVERURL);
r.call().then(res => {
    console.log("RESULT", res);
    Page.load(res[constants.KEY]);
})
