
function kekule_wrapper(el, mode, width, height) {
	this.el = el;
	this.mode = mode || "editor";
	this._width = width || 800;
	this._height = height || 600;
	this._data = undefined;

	Object.defineProperty(this, "data", {
		'get' : function() {
			if (this.mode == "floater") return this._data;
			var co = this.applet.getChemObj();
			var data = Kekule.IO.saveMimeData(co, 'chemical/x-kekule-json');
			return data;
		},
		'set' : function(v) {
			if (v === undefined) {
				//console.log("Unimplemented clear in kekule_wrapper");
				return;
			}
			var co = Kekule.IO.loadMimeData(v, 'chemical/x-kekule-json');
			this.applet.setChemObj(co);
			this._data = v;
		}
	});

	this._sync_size = function() {
		this.el.style.width = this._width + "px";
		this.el.style.height = this._height + "px";
		window.top.dispatchEvent(new Event('resize'));
		if (typeof this.applet === "undefined") return;
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

	this.edit_open_handler = function() {
		if (typeof this.floater !== "undefined") return;
		this.editor = new Kekule.Editor.Composer(document);
		this.floater = new floater(undefined, "Kekule", undefined, undefined, 800, 400);

		this.floater.add_button("Cancel", function() {
			this.floater.remove();
			this.floater = undefined;
			this.editor = undefined;
		}.bind(this));

		this.floater.add_button("Ok", function() {
			var co = this.editor.getChemObj();
			this.data = Kekule.IO.saveMimeData(co, 'chemical/x-kekule-json');
			this.floater.remove();
			this.floater = undefined;
			this.editor = undefined;
			this.raise_event("changed", this);
		}.bind(this));

		setTimeout(function() {
			this.editor.setDimension(800, 400);
			this.editor.appendToElem(this.floater.content_container);
			this.floater.on_resize = function(width, height) {
				this.editor.setDimension(width, height);
			}.bind(this);

			if (this._data !== undefined) {
				var co = Kekule.IO.loadMimeData(this._data, 'chemical/x-kekule-json');
				this.editor.setChemObj(co);
			}
		}.bind(this), 100);
	}.bind(this);

	if (this.mode == "editor") {
		this.applet = new Kekule.Editor.Composer(document);
	} else if(this.mode == "floater") {
		this.viewer_container = build("div", "kekule_viewer_container", this.el);
		this.viewer_container_inner = build("div", "kekule_viewer_container_inner", this.viewer_container);
		this.viewer_frame = build("div", "frame", this.viewer_container);
		this.edit_button = build("div", "edit_button", this.viewer_frame);
		this.edit_button.addEventListener("click", this.edit_open_handler);
		this.applet = new Kekule.ChemWidget.Viewer2D(document);

	} else {
		this.applet = new Kekule.ChemWidget.Viewer2D(document);
	}

	this.lazy_append = function() {
		if (this.mode == "floater") {
			this.applet.appendToElem(this.viewer_container_inner);
		} else {
			this.applet.appendToElem(this.el);
		}
		this._sync_size();
	}.bind(this);

	setTimeout(this.lazy_append, 0);
	console.log("hai");	
	make_eventable(this);
}
