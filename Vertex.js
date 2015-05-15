function Vertex(x, y, z) {
	THREE.Vector3.call(this, x, y, z);
	this.edges = [];
}

Vertex.prototype = Object.create(THREE.Vector3.prototype);

Vertex.prototype.addEdge = function(edge) {
	this.edges.push[edge];
}

Vertex.prototype.removeEdge = function(edge) {
	this.edges = this.edges.filter(function(e) {
		return edge !== e;
	})
}

Vertex.prototype.clone = function() {
	return new Vertex( this.x, this.y, this.z );
}
module.exports = Vertex;