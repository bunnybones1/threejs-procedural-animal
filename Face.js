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

Face.prototype = {
	getFace: function(vertices) {
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
	computeNormal: function() {
		
	}
}
module.exports = Face;