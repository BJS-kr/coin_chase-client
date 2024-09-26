export namespace main {
	
	export class ClientAttack {
	
	
	    static createFrom(source: any = {}) {
	        return new ClientAttack(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class ClientStatus {
	
	
	    static createFrom(source: any = {}) {
	        return new ClientStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

export namespace protodef {
	
	export class Position {
	    x?: number;
	    y?: number;
	
	    static createFrom(source: any = {}) {
	        return new Position(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x = source["x"];
	        this.y = source["y"];
	    }
	}
	export class Cell {
	    occupied?: boolean;
	    owner?: string;
	    kind?: number;
	
	    static createFrom(source: any = {}) {
	        return new Cell(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.occupied = source["occupied"];
	        this.owner = source["owner"];
	        this.kind = source["kind"];
	    }
	}
	export class RelatedPosition {
	    position?: Position;
	    // Go type: Cell
	    cell?: any;
	
	    static createFrom(source: any = {}) {
	        return new RelatedPosition(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.position = this.convertValues(source["position"], Position);
	        this.cell = this.convertValues(source["cell"], null);
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
	export class RelatedPositions {
	    related_positions?: RelatedPosition[];
	    user_position?: Position;
	    scoreboard?: {[key: string]: number};
	
	    static createFrom(source: any = {}) {
	        return new RelatedPositions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.related_positions = this.convertValues(source["related_positions"], RelatedPosition);
	        this.user_position = this.convertValues(source["user_position"], Position);
	        this.scoreboard = source["scoreboard"];
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

}

