var idCounter = 0;

function Face(edge1, edge2, edge3, flip) {
	this.edges = flip ? [edge1, edge2, edge3] : [edge3, edge2, edge1];
	var _this = this;
	this.edges.forEach(function(edge){
		edge.addFace(_this);
	})
	this.id = idCounter;
	idCounter++;
}

var normal = new THREE.Vector3();
var tempVec3 = new THREE.Vector3();

Face.prototype = {
	getFace: function() {
		var verts = [
			this.edges[0].getSharedVertex(this.edges[1]),
			this.edges[1].getSharedVertex(this.edges[2]),
			this.edges[2].getSharedVertex(this.edges[0])
		];
		return new THREE.Face3(verts[0], verts[1], verts[2]);
	},
	getPrevEdge: function(edge) {
		return this.edges[(this.edges.indexOf(edge)+2)%3];
	},
	getNextEdge: function(edge) {
		return this.edges[(this.edges.indexOf(edge)+1)%3];
	},
	getVertexOpposingEdge: function(edge) {
		return this.getNextEdge(edge).getUnsharedVertex(edge);
	},
	removeItselfFromEdges: function() {
		var _this = this;
		this.edges.forEach(function(edge){
			edge.removeFace(_this);
		})
	},
	getNormal: function() {
		var face = this.getFace();

		normal.subVectors( face.c, face.b );
		tempVec3.subVectors( face.a, face.b );
		normal.cross( tempVec3 );

		normal.normalize();

		return normal;
	}
}
module.exports = Face;