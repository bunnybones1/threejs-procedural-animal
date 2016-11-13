var GeometryGeneratorTetraHedron = require('./GeometryGeneratorTetraHedron');
function AnimalGeometry(sizeX, sizeY, sizeZ, segsX, segsY, segsZ) {
	THREE.Geometry.call(this);

	var geometryGenerator = new GeometryGeneratorTetraHedron(sizeX);
	this.vertices = geometryGenerator.collectVertices();
	this.faces = geometryGenerator.collectFaces();
	this.computeFaceNormals();
	this.computeVertexNormals();
}

AnimalGeometry.prototype = Object.create(THREE.Geometry.prototype);
module.exports = AnimalGeometry;