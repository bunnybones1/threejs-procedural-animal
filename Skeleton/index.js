var Vertex = require('../Vertex');
var Edge = require('../Edge');
var SkeletonPreviewPoints = require('./SkeletonPreviewPoints');

function __makeSplittingArguments(boneName, splitTimes, baseName, nameBackwards, proportions){
	if(!proportions) {
		proportions = [];
		for (var i = 0; i < splitTimes; i++) {
			proportions[i] = 1;
		}
	}
	var normalizer = 0;
	for (var i = 0; i < splitTimes; i++) {
		normalizer += proportions[i];
	}

	for (var i = 0; i < splitTimes; i++) {
		proportions[i] /= normalizer;
	}

	var divisions = [];
	var accumilator = 0;
	for (var i = 0; i < splitTimes; i++) {
		accumilator += proportions[i];
		divisions[i] = accumilator;
	}

	var boneNames = [];
	for (var i = 1; i <= splitTimes; i++) {
		boneNames.push(baseName+i);
	}

	if(nameBackwards) {
		boneNames.reverse();
	}
	// ['c7','c6','c5','c4','c3','c2','c1']
	var jointNames = [];
	for (var i = 1; i < splitTimes; i++) {
		jointNames.push(boneNames[i-1] + '-' + boneNames[i]);
	}
	// ['c7-c6','c6-c5','c5-c4','c4-c3','c3-c2','c2-c1']
	return [
		boneName,
		divisions,
		boneNames,
		jointNames
	];
}

function Skeleton() {
	this.joints = {};
	this.bones = {};

	this.addJoint('hip-spine', 0, 0.9, 0);
	this.addJoint('tailTip', 0, 0.8, 0);
	this.addJoint('head-neck', 0, 1.46, 0);
	this.addJoint('philange-1-distal-tip', 0.7, 1.56, 0);
	this.addJoint('philange-2-distal-tip', 0.8, 1.46, 0);
	this.addJoint('philange-3-distal-tip', 0.81, 1.41, 0);
	this.addJoint('philange-4-distal-tip', 0.8, 1.36, 0);
	this.addJoint('philange-5-distal-tip', 0.78, 1.31, 0);
	this.addJoint('tarsal-1-distal-tip', 0.33, -0.15, 0);

	this.addBone('spine', 'hip-spine', 'head-neck');
	this.cutBone(
		'spine', 
		[0.2, 0.8],
		['spine-lumbar', 'spine-thoracic', 'spine-cervical'],
		['l1-t12', 't1-c7']
	);
	this.cutBoneManyTimes('spine-cervical', 7, 'spine-c', true);
	this.cutBoneManyTimes('spine-thoracic', 12, 'spine-t', true);
	this.cutBoneManyTimes('spine-lumbar', 5, 'spine-l', true);

	this.addBone('arm', 't1-c7', 'philange-2-distal-tip');
	this.addBone('leg', 'hip-spine', 'tarsal-1-distal-tip');
	this.cutBoneManyTimes('arm', 7, 'arm', false, [18, 30, 26, 8, 5, 3, 2, 1]);
	this.cutBoneManyTimes('leg', 7, 'leg', false, [14, 38, 40, 13, 4, 1.5, 1, 0.5]);

	this.addBone('thumb', 'arm3-arm4', 'philange-1-distal-tip');
	this.cutBoneManyTimes('thumb', 3, 'thumb', false, [8, 5, 3, 2]);
	this.addBone('philange-3', 'arm3-arm4', 'philange-3-distal-tip');
	this.cutBoneManyTimes('philange-3', 3, 'philange-3', false, [8, 5, 3, 2, 1]);
	this.addBone('philange-4', 'arm3-arm4', 'philange-4-distal-tip');
	this.cutBoneManyTimes('philange-4', 3, 'philange-4', false, [8, 5, 3, 2, 1]);
	this.addBone('philange-5', 'arm3-arm4', 'philange-5-distal-tip');
	this.cutBoneManyTimes('philange-5', 3, 'philange-5', false, [8, 5, 3, 2, 1]);
	// this.cutBoneManyTimes('arm', 6, 'arm', false, [18, 30, 26, 8, 5, 3, 2]);
	// this.cutBoneManyTimes('arm', 6, 'arm', false, [18, 30, 26, 8, 5, 3, 2]);
	// this.cutBoneManyTimes('arm', 6, 'arm', false, [18, 30, 26, 8, 5, 3, 2]);



	this.addBone('spine', 'hip-spine', 'tailTip');
}

Skeleton.prototype.createPreview = function() {
	return new SkeletonPreviewPoints(this);
}

Skeleton.prototype.addJoint = function(name, x, y, z) {
	this.joints[name] = new Vertex(x, y, z);
}

Skeleton.prototype.addBone = function(name, jointNameA, jointNameB) {
	this.bones[name] = new Edge(this.joints[jointNameA], this.joints[jointNameB]);
}

Skeleton.prototype.cutBoneManyTimes = function(boneName, splitTimes, baseName, nameBackwards, proportions) {
	this.cutBone.apply(this, __makeSplittingArguments(boneName, splitTimes, baseName, nameBackwards, proportions));
}

Skeleton.prototype.cutBone = function(boneName, divisions, boneNames, jointNames) {
	var originalBone = this.bones[boneName];
	delete this.bones[boneName];
	var results = originalBone.splitManyTimes(divisions);
	for (var i = 0; i < boneNames.length; i++) {
		this.bones[boneNames[i]] = results.edges[i];
	}
	for (var i = 0; i < boneNames.length; i++) {
		this.joints[jointNames[i]] = results.vertices[i+1];
	}
	originalBone.disconnect();
}

module.exports = Skeleton;