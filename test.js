var ManagedView = require('threejs-managed-view');
var loadAndRunScripts = require('loadandrunscripts');
var Resize = require('input-resize');
window.THREE = require('three');
loadAndRunScripts(
	[
		'lib/stats.min.js',
		'lib/threex.rendererstats.js'
	],
	function() {
		var clock = new THREE.Clock();
		var Animal = require('./');
		var Skeleton = require('./Skeleton');
		Resize.minWidth = 600;
		Resize.minHeight = 400;
		var view = new ManagedView.View({
			stats:true
		});
		view.camera.position.multiplyScalar(4);

		// view.renderManager.skipFrames = 5;

		var light = new THREE.HemisphereLight(0x7f9fff, 0x7f4f3f, 1);
		view.scene.add(light);

		var totalLength = 10;
		var totalSegments = 4;
		var segmentLength = totalLength / totalSegments;
		var skeleton = new Skeleton();
		var skeletonPreview = skeleton.createPreview();
		skeletonPreview.position.y = -5;
		skeletonPreview.scale.multiplyScalar(8);
		view.scene.add(skeletonPreview);
		return;
		var bones = [{"parent":-1,"name":"BoneRoot","pos":[0,-.5 * totalLength,0],"rotq":[0,0,0,1]}];
		for (var i = 1; i <= totalSegments; i++) {
			bones.push({"parent":i-1,"name":"Bone"+i+1,"pos":[0,segmentLength,0],"rotq":[0,0,0,1]});
		};

		for(var i = 0, totalAnimals = 1; i < totalAnimals; i++) {
			var animal = new Animal(bones);
			animal.position.x = i - totalAnimals*.5;
			var skelHelp = new THREE.SkeletonHelper(animal);
			view.scene.add(skelHelp);
			view.renderManager.onEnterFrame.add(animal.update);
			view.renderManager.onEnterFrame.add(skelHelp.update.bind(skelHelp));
			view.scene.add(animal);
		}

		var first = true;
		view.renderManager.onEnterFrame.add(function() {
			var delta = clock.getDelta();
			if(first) {
				console.log(animal);
				first = false;
			}
			animal.rotation.y += 0.02;
		})


	}
)