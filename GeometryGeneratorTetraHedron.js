var Vertex = require('./Vertex');
var Edge = require('./Edge');
var Face = require('./Face');
function GeometryGeneratorTetraHedron(size, densityModel) {
	size = size || 1;
	this.vertices = [];
	this.edges = [];
	this.faces = [];

	var topLeft = this.createVertex(-size, -5, 0);		//Top Left
	var topRight = this.createVertex(size, -5, 0);		//Top Right
	var bottomRear = this.createVertex(0, 5, -size);	//Bottom Rear
	var bottomFront = this.createVertex(0, 5, size);	//Bottom Front

	var topEdge = this.createEdge(topLeft, topRight);
	var bottomEdge = this.createEdge(bottomRear, bottomFront);
	var rearLeftEdge = this.createEdge(topLeft, bottomRear);
	var rearRightEdge = this.createEdge(topRight, bottomRear);
	var frontLeftEdge = this.createEdge(topLeft, bottomFront);
	var frontRightEdge = this.createEdge(topRight, bottomFront);

	this.createFace(topEdge, rearLeftEdge, rearRightEdge, true);
	this.createFace(topEdge, frontLeftEdge, frontRightEdge);
	this.createFace(bottomEdge, frontLeftEdge, rearLeftEdge);
	this.createFace(bottomEdge, frontRightEdge, rearRightEdge, true);

	var len = topEdge.getLength();
	// this.splitEdge(topEdge);
	// this.splitEdge(bottomEdge);
	// this.splitEdge(rearLeftEdge);
	// this.splitEdge(rearRightEdge);
	// this.splitEdge(frontLeftEdge);
	// this.splitEdge(frontRightEdge);
	// return;

	for (var i = 0, total = 500; i < total; i++) {
		this.edges.sort(function(a, b) {
			return b.length - a.length;
		});
		this.splitEdge(this.edges[0]);
	};


	// for (var i = 0, total = 20; i < total; i++) {
	// 	this.edges.forEach(function(edge) {
	// 		edge.attemptLength(.05, .95);
	// 	})
	// }

	for (var i = 0, total = 1500; i < total; i++) {

		this.edges.sort(function(a, b) {
			return b.length - a.length;
		});
		this.splitEdge(this.edges[0]);
	};

	// for (var i = 0, total = 10; i < total; i++) {

	// 	this.edges.forEach(function(edge) {
	// 		edge.attemptLength(.05, .95);
	// 	})
	// }
	
}
GeometryGeneratorTetraHedron.prototype = {
	createVertex: function(x, y, z) {
		var vert = new Vertex(x, y, z);
		this.vertices.push(vert);
		return vert;
	},
	createEdge: function(v1, v2) {
		var edge = new Edge(v1, v2);
		this.edges.push(edge);
		return edge;
	},
	createFace: function(e1, e2, e3, flip) {
		var face = new Face(e1, e2, e3, flip);
		this.faces.push(face);
		return face;
	},
	destroyEdge: function(edge) {
		this.edges = this.edges.filter(function(e){
			return (e !== edge);
		});
	},
	destroyFace: function(face) {
		this.faces = this.faces.filter(function(f){
			return (f !== face);
		});
		face.removeItselfFromEdges();
	},
	collectVertices: function() {
		return this.vertices;
	},
	collectFaces: function() {
		var faces = [];
		for (var i = this.faces.length - 1; i >= 0; i--) {
			var face = this.faces[i].getFace(this.vertices);
			if(face) {
				faces.push(face);
				//convert vertices to vertex indices
				face.a = this.vertices.indexOf(face.a);
				face.b = this.vertices.indexOf(face.b);
				face.c = this.vertices.indexOf(face.c);
			}
		};
		return faces;
	},
	splitEdge: function(edge) {
		var faces = edge.faces;
		var newParts = edge.split();
		this.vertices.push(newParts.vertex);
		this.edges.push(newParts.edges[0]);
		this.edges.push(newParts.edges[1]);
		getNewEdgeConnectedTo = function(sharedEdge) {
			if(sharedEdge.isConnectedTo(newParts.edges[0])) return newParts.edges[0];
			if(sharedEdge.isConnectedTo(newParts.edges[1])) return newParts.edges[1];
		}
		var _this = this;
		faces.forEach(function(f){
			var splitEdge = new Edge(newParts.vertex, f.getVertexOpposingEdge(edge));
			_this.edges.push(splitEdge);
			var prevEdge = f.getPrevEdge(edge);
			var nextEdge = f.getNextEdge(edge);
			_this.createFace(splitEdge, getNewEdgeConnectedTo(prevEdge), prevEdge, f.flip);
			_this.createFace(splitEdge, nextEdge, getNewEdgeConnectedTo(nextEdge), f.flip);
			_this.destroyFace(f);
		});
		this.destroyEdge(edge);
	}
};

module.exports = GeometryGeneratorTetraHedron;