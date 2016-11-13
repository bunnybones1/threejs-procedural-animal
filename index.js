var ensureLoop = require('./animation-ensure-loop');
var AnimalGeometry = require('./AnimalGeometry');
function Animal(bones) {
	this.sway = Math.random() * .2 + .7;
	this.speed = Math.random() * .001 + .001;

	var totalLength = 10;
	var thickness = .3 + Math.random();
	var subdivisions = 3;
	var geom = new AnimalGeometry(thickness, totalLength, thickness, subdivisions, totalLength*subdivisions, subdivisions);
	geom.bones = bones;

	var skinWeights = geom.skinWeights = [];
	var skinIndices = geom.skinIndices = [];
	for (var i = 0; i < geom.vertices.length; i++) {
		var rand = geom.vertices[i].y < 0 ? 1 : 0;
		skinWeights[i] = new THREE.Vector4(rand, -rand);
		skinIndices[i] = new THREE.Vector4(0, 1);
	};
	var mat = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		shininess: 50,
		// shading: THREE.FlatShading,
		// wireframe: true,
		// side: THREE.DoubleSide,
		skinning: true
	});
	THREE.SkinnedMesh.call(this, geom, mat);
	this.update = this.update.bind(this);

	this.envelopes = [];
	for (var i = 0; i < this.skeleton.bones.length; i++) {
		var bone = this.skeleton.bones[i];
		// bone.add(new THREE.Mesh(new THREE.SphereGeometry(.5)));

		if(bone.parent !== this) {
			var v1 = this.worldToLocal(bone.parent.localToWorld(new THREE.Vector3()));
			var v2 = this.worldToLocal(bone.localToWorld(new THREE.Vector3()));
			var envelopeLine = new THREE.Line3(v1, v2);
			bone.parent.envelope = envelopeLine;
			envelopeLine.bone = bone.parent;
			envelopeLine.radius = 1.25;
			envelopeLine.index = this.skeleton.bones.indexOf(bone.parent);
			this.envelopes.push(envelopeLine);
		}
	};

	var _this = this;

	function sortDistFromLines(a, b) {
		return a.distFromLine - b.distFromLine;
	}
	function findTheClosestEnvelopes(vert) {
		var closest = [];
		for (var i = 0; i < _this.envelopes.length; i++) {
			var envelope = _this.envelopes[i];
			var closestPointOnLine = envelope.closestPointToPoint(vert, true);
			var distFromLine = closestPointOnLine.sub(vert).length();
			closest.push({
				envelope: envelope,
				distFromLine: distFromLine
			});
		};
		closest.sort(sortDistFromLines);
		return closest;
	}

	for (var i = 0; i < geom.vertices.length; i++) {
		var envelopes = findTheClosestEnvelopes(geom.vertices[i]);

		if(envelopes[0].distFromLine < envelopes[0].envelope.radius && envelopes[1].distFromLine < envelopes[1].envelope.radius) {
			skinWeights[i] = new THREE.Vector4(100*(1-(envelopes[0].distFromLine/envelopes[0].envelope.radius)), 100*(1-(envelopes[1].distFromLine/envelopes[1].envelope.radius)));
		} else if (envelopes[0].distFromLine / envelopes[0].envelope.radius > envelopes[1].distFromLine / envelopes[1].envelope.radius) {
			skinWeights[i] = new THREE.Vector4(0, 100);
		} else {
			skinWeights[i] = new THREE.Vector4(100, 0);
		}
		skinIndices[i] = new THREE.Vector4(envelopes[0].envelope.index, envelopes[1].envelope.index);
	};

}

Animal.prototype = Object.create(THREE.SkinnedMesh.prototype);

Animal.prototype.update = function(delta) {
	// return;
	var time = (new Date).getTime();
	for (var i = 0; i < this.skeleton.bones.length; i++) {
		var bone = this.skeleton.bones[i];
		bone.rotation.x = Math.sin(time*this.speed+i*2+Math.PI)*this.sway;
		bone.rotation.y = Math.sin(time*this.speed+i*2+Math.PI)*this.sway;
		bone.rotation.z = Math.sin(time*this.speed+i*2)*this.sway;
		// bone.rotation.x -= 0.02;
	};
}

module.exports = Animal;