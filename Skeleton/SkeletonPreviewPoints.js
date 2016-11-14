function SkeletonPreviewPoints(skeleton) {
	var geometry = new THREE.Geometry();
	Object.keys(skeleton.joints).forEach(function(key) {
		geometry.vertices.push(skeleton.joints[key]);
	});
	var color = 0xffffff;
	var material = new THREE.PointsMaterial( { 
		color: color,
		size: 0.5, 
		sizeAttenuation: true
	} );
	THREE.Points.call(this, geometry, material);

	var lineGeometry = new THREE.Geometry();
	Object.keys(skeleton.bones).forEach(function(key) {
		lineGeometry.vertices.push(skeleton.bones[key].v1, skeleton.bones[key].v2);
	});
	var lineMaterial = new THREE.LineBasicMaterial({ 
		color: color, 
		linewidth: 1
	} );
	var line = new THREE.LineSegments( lineGeometry, lineMaterial );
	this.add(line);
}

SkeletonPreviewPoints.prototype = Object.create(THREE.Points.prototype);

module.exports = SkeletonPreviewPoints;