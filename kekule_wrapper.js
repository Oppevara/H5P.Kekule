
function kekule_wrapper(el, mode, width, height) {
	this.el = el;
	this.mode = mode || "editor";
	this._width = width || 800;
	this._height = height || 600;

	if (this.mode == "editor") {
		this.applet = new Kekule.Editor.Composer(document);
	} else {
		this.applet = new Kekule.ChemWidget.Viewer2D(document);
	}
	this.applet.appendToElem(this.el);


	Object.defineProperty(this, "data", {
		'get' : function() {
			var co = this.applet.getChemObj();
			var data = Kekule.IO.saveMimeData(co, 'chemical/x-kekule-json');
			return data;
		},
		'set' : function(v) {
			var co = Kekule.IO.loadMimeData(v, 'chemical/x-kekule-json');
			this.applet.setChemObj(co);
		}
	});

	this._sync_size = function(w, h) {
		this.el.style.with = this._width + "px";
		this.el.style.height = this._height + "px";
		this.applet.setDimension(this._width + "px", this._height + "px");
	};

	Object.defineProperty(this, "width", {
		'get' : function() {
			return this._width;
		},
		'set' : function(v) {
			this._width = v;
			this._sync_size();
		}
	}); 

	Object.defineProperty(this, "height", {
		'get' : function() {
			return this._height;
		},
		'set' : function(v) {
			this._height = v;
			this._sync_size();
		}
	});

	this.add_data = function(data) {
		var data = this.data;
		console.log(data);
	};

	this.rem_data = function(data) {

	};

	this.get_data_hull = function() {
		var data = this.data;

	};

	this.width = this.width;
}


