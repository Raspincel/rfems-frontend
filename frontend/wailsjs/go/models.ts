export namespace bindings {
	
	export class ConnectToHostResponse {
	    ticket: string;
	
	    static createFrom(source: any = {}) {
	        return new ConnectToHostResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ticket = source["ticket"];
	    }
	}
	export class Error {
	    code: string;
	    field?: string;
	    message: string;
	
	    static createFrom(source: any = {}) {
	        return new Error(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.field = source["field"];
	        this.message = source["message"];
	    }
	}
	export class LoginRequest {
	    email: string;
	    password: string;
	    handle: string;
	
	    static createFrom(source: any = {}) {
	        return new LoginRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.email = source["email"];
	        this.password = source["password"];
	        this.handle = source["handle"];
	    }
	}
	export class LoginResponse {
	    accessToken: string;
	
	    static createFrom(source: any = {}) {
	        return new LoginResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.accessToken = source["accessToken"];
	    }
	}
	export class Me {
	    id: string;
	    name: string;
	    email: string;
	    isAdmin: boolean;
	    // Go type: time
	    createdAt: any;
	    // Go type: time
	    updatedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new Me(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.email = source["email"];
	        this.isAdmin = source["isAdmin"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.updatedAt = this.convertValues(source["updatedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Meta {
	    trace_id: string;
	    // Go type: time
	    timestamp: any;
	
	    static createFrom(source: any = {}) {
	        return new Meta(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.trace_id = source["trace_id"];
	        this.timestamp = this.convertValues(source["timestamp"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class UserBasicInfo {
	    name: string;
	    id: string;
	    lastActiveAt: string;
	    status: string;
	    folderBeingHosted: string;
	    isPublic: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UserBasicInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.id = source["id"];
	        this.lastActiveAt = source["lastActiveAt"];
	        this.status = source["status"];
	        this.folderBeingHosted = source["folderBeingHosted"];
	        this.isPublic = source["isPublic"];
	    }
	}
	export class Response___frontend_bindings_UserBasicInfo_ {
	    success: boolean;
	    message: string;
	    data: UserBasicInfo[];
	    meta: Meta;
	    errors?: Error[];
	
	    static createFrom(source: any = {}) {
	        return new Response___frontend_bindings_UserBasicInfo_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.data = this.convertValues(source["data"], UserBasicInfo);
	        this.meta = this.convertValues(source["meta"], Meta);
	        this.errors = this.convertValues(source["errors"], Error);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Response_frontend_bindings_ConnectToHostResponse_ {
	    success: boolean;
	    message: string;
	    data: ConnectToHostResponse;
	    meta: Meta;
	    errors?: Error[];
	
	    static createFrom(source: any = {}) {
	        return new Response_frontend_bindings_ConnectToHostResponse_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.data = this.convertValues(source["data"], ConnectToHostResponse);
	        this.meta = this.convertValues(source["meta"], Meta);
	        this.errors = this.convertValues(source["errors"], Error);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Response_frontend_bindings_LoginResponse_ {
	    success: boolean;
	    message: string;
	    data: LoginResponse;
	    meta: Meta;
	    errors?: Error[];
	
	    static createFrom(source: any = {}) {
	        return new Response_frontend_bindings_LoginResponse_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.data = this.convertValues(source["data"], LoginResponse);
	        this.meta = this.convertValues(source["meta"], Meta);
	        this.errors = this.convertValues(source["errors"], Error);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Response_frontend_bindings_Me_ {
	    success: boolean;
	    message: string;
	    data: Me;
	    meta: Meta;
	    errors?: Error[];
	
	    static createFrom(source: any = {}) {
	        return new Response_frontend_bindings_Me_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.data = this.convertValues(source["data"], Me);
	        this.meta = this.convertValues(source["meta"], Meta);
	        this.errors = this.convertValues(source["errors"], Error);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class SelectedFolder {
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new SelectedFolder(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	    }
	}
	export class Response_frontend_bindings_SelectedFolder_ {
	    success: boolean;
	    message: string;
	    data: SelectedFolder;
	    meta: Meta;
	    errors?: Error[];
	
	    static createFrom(source: any = {}) {
	        return new Response_frontend_bindings_SelectedFolder_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.data = this.convertValues(source["data"], SelectedFolder);
	        this.meta = this.convertValues(source["meta"], Meta);
	        this.errors = this.convertValues(source["errors"], Error);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Response_interface____ {
	    success: boolean;
	    message: string;
	    data: any;
	    meta: Meta;
	    errors?: Error[];
	
	    static createFrom(source: any = {}) {
	        return new Response_interface____(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.data = source["data"];
	        this.meta = this.convertValues(source["meta"], Meta);
	        this.errors = this.convertValues(source["errors"], Error);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class StartHostingRequest {
	    folderPath: string;
	    isPublic: boolean;
	
	    static createFrom(source: any = {}) {
	        return new StartHostingRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.folderPath = source["folderPath"];
	        this.isPublic = source["isPublic"];
	    }
	}

}

