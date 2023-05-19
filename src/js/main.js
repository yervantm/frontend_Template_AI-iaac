System.register("constants", [], function (exports_1, context_1) {
    "use strict";
    var constants;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("constants", constants = {
                SERVERURL: "WEBSITEURL",
                LOCALHOST_URL: "https://localhost:3000",
                KEY: "content"
            });
        }
    };
});
System.register("page", [], function (exports_2, context_2) {
    "use strict";
    var Page;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Page = class Page {
                constructor() {
                }
                make() { }
                static load(content) {
                    let root = document.querySelector("html");
                    if (typeof (content) == "string" && root != null) {
                        root.innerHTML = content;
                    }
                    return new Promise((res) => res(root));
                }
            };
            exports_2("Page", Page);
        }
    };
});
System.register("request", ["constants"], function (exports_3, context_3) {
    "use strict";
    var constants_1, METHODS, ServerRequest, LocalServerRequest;
    var __moduleName = context_3 && context_3.id;
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    return {
        setters: [
            function (constants_1_1) {
                constants_1 = constants_1_1;
            }
        ],
        execute: function () {
            (function (METHODS) {
                METHODS["POST"] = "POST";
                METHODS["GET"] = "GET";
            })(METHODS || (METHODS = {}));
            ServerRequest = class ServerRequest {
                constructor(params, url) {
                    this.params = params;
                    this.method = METHODS.GET;
                    this.url = url ? url : constants_1.constants.SERVERURL;
                }
                call() {
                    return this.request();
                }
                getBaseUrl() {
                    return this.url;
                }
                getUrl() {
                    let query = this.getQuery();
                    if (query == "") {
                        return this.getBaseUrl();
                    }
                    return `${this.getBaseUrl()}?${query}`;
                }
                getQuery() {
                    let s = "";
                    for (let key in this.params) {
                        s += `${key}=${this.params[key]}\&`;
                    }
                    console.log(`query: ${s}`);
                    return s;
                }
                request(callback = null) {
                    const url = this.getUrl();
                    console.log(`URL: ${url}`);
                    return fetch(url, {
                        method: this.method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST',
                            'Access-Control-Allow-Headers': 'Content-Type'
                        },
                        mode: 'cors',
                    }).then(result => {
                        if (result.status == 200) {
                            if (callback != undefined) {
                                result.json().then(r => callback(r));
                            }
                            return result.json(); //result.json();
                        }
                        else if (result.status == 429) {
                            return sleep(1000).then(r => { return this.request(); });
                        }
                        else if (result.status == 504) {
                            return this.request();
                        }
                        else {
                            console.log(`CODE: ${result.status}`);
                        }
                        return result;
                    });
                }
            };
            exports_3("ServerRequest", ServerRequest);
            LocalServerRequest = class LocalServerRequest extends ServerRequest {
                constructor(params, url) {
                    super(params, url ? url : constants_1.constants.LOCALHOST_URL);
                    this.method = METHODS.GET;
                }
            };
            exports_3("LocalServerRequest", LocalServerRequest);
        }
    };
});
System.register("main", ["constants", "page", "request"], function (exports_4, context_4) {
    "use strict";
    var constants_2, page_1, request_1, r;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (constants_2_1) {
                constants_2 = constants_2_1;
            },
            function (page_1_1) {
                page_1 = page_1_1;
            },
            function (request_1_1) {
                request_1 = request_1_1;
            }
        ],
        execute: function () {
            console.log("start");
            r = new request_1.ServerRequest({}, constants_2.constants.SERVERURL);
            r.call().then(res => {
                console.log("RESULT", res);
                page_1.Page.load(res[constants_2.constants.KEY]);
            });
        }
    };
});
