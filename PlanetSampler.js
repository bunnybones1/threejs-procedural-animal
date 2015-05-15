var SimplexNoise = require('simplex-noise');
var _ = require('lodash');
function PlanetSampler(sphere, octaves) {
	
	this.simplex = new SimplexNoise(Math.random);
	if(!octaves) {
		octaves = [];
		for (var i = 1, totalOctaves = 4; i <= totalOctaves; i++) {
			octaves.push({
				frequency: Math.pow(2, i),
				magnitude: 1/i
			})
		};
	}
	this.octaves = octaves;

	sphere = _.assign({
		inner: .5,
		outer: .8,
		density: 4
	}, sphere || {});
	sphere.range = sphere.outer - sphere.inner;

	this.sphere = sphere;

	this.magnitudeNormalizeScale = sphere.density;
	var _this = this;
	octaves.forEach(function(octave) {
		_this.magnitudeNormalizeScale += octave.magnitude;
	})
}

var sphereSample = new THREE.Vector3();
PlanetSampler.prototype = {

	sphereSampler: function(x, y, z) {
		var val = 0;
		sphereSample.set(x, y, z);
		val = sphereSample.length();
		val = (val - this.sphere.inner) / this.sphere.range;
		val = 1 - Math.min(1, Math.max(0, val));
		val *= this.sphere.density;
		return val;
	},
	simplexSampler: function(x, y, z) {
		var val = 0;
		var _this = this;
		this.octaves.forEach(function(octave){
			val += _this.simplex.noise3D(x * octave.frequency, y * octave.frequency, z * octave.frequency) * octave.magnitude;
		})
		return val;
	},
	sample: function(x, y, z) {
		var val = 0;
		val += this.sphereSampler(x, y, z);
		val += this.simplexSampler(x, y, z);
		val = val / this.magnitudeNormalizeScale + .5;
		val = Math.min(1, Math.max(0, val));
		return val;
	}
}

module.exports = PlanetSampler;