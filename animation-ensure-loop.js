function ensureLoop( animation ) {

	for ( var i = 0; i < animation.hierarchy.length; i ++ ) {

		var obj = animation.hierarchy[ i ];

		var first = obj.keys[ 0 ];
		var last = obj.keys[ obj.keys.length - 1 ];

		last.pos = first.pos;
		last.rot = first.rot;
		last.scl = first.scl;

	}

};

module.exports = ensureLoop;