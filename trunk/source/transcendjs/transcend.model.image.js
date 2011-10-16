//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("ImageModel", "ModelAbstract", /** @lends ImageModel */ {
	/**
	 * @class Simple model for seemlessly integrating DOM Images
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit: function () {
		this.className ("Image");
		this.defaultIterator (null);
	},

	oncreate: function (image) {
		return image || new Image ();
	}
});

