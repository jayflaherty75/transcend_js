//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

//-----------------------------------------------------------------------------
Core.extend ("ImageModel", "ModelAbstract", (function () {
	var ImageModel = /** @lends ImageModel.prototype */ {
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
	};

	return ImageModel;
}) ());

