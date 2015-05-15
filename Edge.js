var idCounter = 0;
function Edge(v1, v2) {
	this.v1 = v1;
	this.v2 = v2;
	v1.addEdge(this);
	v2.addEdge(this);
	this.getLength();
	this.faces = [];
	this.id = idCounter;
	idCounter++;
}

Edge.prototype = {
	getLength: function() {
		this.length = this.v1.clone().sub(this.v2).length();
		return this.length;
	},
	addFace: function(face) {
		this.faces.push(face);
	},
	removeFace: function(face) {
		this.faces = this.faces.filter(function(f) {
			return (face !== f);
		})
	},
	split: function() {
		var vertex = this.v1.clone().add(this.v2).multiplyScalar(.5);
		var edges = [
			new Edge(this.v1, vertex),
			new Edge(vertex, this.v2)
		];
		return {
			vertex: vertex,
			edges: edges
		}
	},
	isConnectedTo: function(edge) {
		if(this.v1 === edge.v1 || this.v1 === edge.v2 || this.v2 === edge.v1 || this.v2 === edge.v2) return true;
		return false;
	},
	getSharedVertex: function(edge) {
		if(this.v1 === edge.v1) return this.v1;
		if(this.v1 === edge.v2) return this.v1;
		if(this.v2 === edge.v1) return this.v2;
		if(this.v2 === edge.v2) return this.v2;

	},
	getUnsharedVertex: function(edge) {
		if(this.v1 !== edge.v1 && this.v1 !== edge.v2) return this.v1;
		if(this.v2 !== edge.v1 && this.v2 !== edge.v2) return this.v2;
	},
	attemptLength: function(length, strength) {
		var center = this.v1.clone().add(this.v2).multiplyScalar(.5);
		var vec = this.v2.clone().sub(this.v1).multiplyScalar(.5);
		var oldLength = this.getLength();
		length -= (length - oldLength) * strength;
		vec.multiplyScalar((length / oldLength));
		this.v1.copy(center).sub(vec);
		this.v2.copy(center).add(vec);
	}
}

module.exports = Edge;