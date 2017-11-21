var H5P = H5P || {};

H5P.Kekule = (function ($) {
  function C(options, id) {
    this.$ = $(this);
    this.options = $.extend(true, {}, {}, options);
    this.id = id;
    this.kekule = undefined;
    this.data = h5p_get_data_obj(this.options.data);
  };
 
  C.prototype.attach = function ($container) {
    var el = build("div", "kekule_wrapper");
    $container.append(el);
    var el_applet_container = build("div", undefined, el);
    el_applet_container.id = random_string();

    this.kekule = new kekule_wrapper(el_applet_container, "viewer");
    var data = undefined;
    try { data = this.data.data; } catch(ex) {}
    this.kekule.data = data;
  };
 
  return C;
})(H5P.jQuery);