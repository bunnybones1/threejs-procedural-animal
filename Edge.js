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

var __tempVec3 = new THREE.Vector3();
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
	split: function(percent) {
		if(percent === undefined) { percent = 0.5; }
		var vertex = this.v1.clone().multiplyScalar(1-percent);
		vertex.add(__tempVec3.copy(this.v2).multiplyScalar(percent));
		var edges = [
			new Edge(this.v1, vertex),
			new Edge(vertex, this.v2)
		];
		return {
			vertex: vertex,
			edges: edges
		}
	},
	splitManyTimes: function(divisions) {
		var v1 = this.v1;
		var v2 = this.v2;
		var vertices = divisions.map(function(percent) {
			var vertex = v1.clone().multiplyScalar(1-percent);
			vertex.add(__tempVec3.copy(v2).multiplyScalar(percent));
			return vertex;
		});
		vertices.unshift(v1);
		vertices.push(v2);
		var edges = [];
		for (var i = 1; i < vertices.length; i++) {
			edges.push(new Edge(vertices[i-1], vertices[i]));
		}
		return {
			vertices: vertices,
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
	},
	getNormal: function() {
		var normal = new THREE.Vector3();
		for (var i = 0; i < this.faces.length; i++) {
			normal.add(this.faces[i].getNormal());
		}
		normal.multiplyScalar(1 / this.faces.length);
		normal.normalize();
		return normal;
	},
	disconnect: function() {
		this.v1.removeEdge(this);
		this.v2.removeEdge(this);
		this.v1 = null;
		this.v2 = null;
	}
}

module.exports = Edge;