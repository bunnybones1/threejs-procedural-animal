var ManagedView = require('threejs-managed-view');
var loadAndRunScripts = require('loadandrunscripts');
var Resize = require('input-resize');

loadAndRunScripts(
	[
		'lib/three.js',
		'lib/stats.min.js',
		'lib/threex.rendererstats.js'
	],
	function() {
		var clock = new THREE.Clock();
		var Animal = require('./');
		Resize.minWidth = 600;
		Resize.minHeight = 400;
		var view = new ManagedView.View({
			stats:true
		});

		// view.renderManager.skipFrames = 5;

		var light = new THREE.HemisphereLight(0x7f9fff, 0x7f4f3f, 1);
		view.scene.add(light);

		for(var i = 0, totalAnimals = 8; i < totalAnimals; i++) {
			var animal = new Animal(function(obj){
				obj.position.x = i - totalAnimals*.5;
				var skelHelp = new THREE.SkeletonHelper(obj);
				view.scene.add(skelHelp);
				view.renderManager.onEnterFrame.add(obj.update);
				view.renderManager.onEnterFrame.add(function() {
					skelHelp.update();
				})
				// THREE.SceneUtils.detach(obj.bone2, obj.bone, view.scene);
				// THREE.SceneUtils.attach(obj.bone2, obj.bone, view.scene);
			});
			view.scene.add(animal);
		}

		var first = true;
		view.renderManager.onEnterFrame.add(function() {
			var delta = clock.getDelta();
			THREE.AnimationHandler.update(delta);
			if(first) {
				console.log(animal);
				first = false;
			}
			animal.rotation.y += 0.02;
		})


	}
)