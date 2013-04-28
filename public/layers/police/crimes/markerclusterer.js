/**
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 * @constructor
 * @extends google.maps.OverlayView
 */

function MarkerClusterer(e, a, d) {
    this.extend(MarkerClusterer, google.maps.OverlayView);
    this.map_ = e;
    this.markers_ = [];
    this.clusters_ = [];
    this.sizes = [53, 66, 90];
    this.styles_ = [];
    this.ready_ = false;
    var b = d || {};
    this.gridSize_ = b.gridSize || 60;
    this.maxZoom_ = b.maxZoom || null;
    this.styles_ = b.styles || [];
    this.imagePath_ = b.imagePath || this.MARKER_CLUSTER_IMAGE_PATH_;
    this.imageExtension_ = b.imageExtension || this.MARKER_CLUSTER_IMAGE_EXTENSION_;
    this.zoomOnClick_ = b.zoomOnClick || true;
    this.setMap(e);
    this.prevZoom_ = this.map_.getZoom();
    var c = this;
    google.maps.event.addListener(this.map_, "zoom_changed", function() {
        var f = c.map_.mapTypes[c.map_.getMapTypeId()].maxZoom;
        var g = c.map_.getZoom();
        if (g < 0 || g > f) {
            return
        }
        if (c.prevZoom_ != g) {
            c.prevZoom_ = c.map_.getZoom();
            c.resetViewport()
        }
    });
    google.maps.event.addListener(this.map_, "bounds_changed", function() {
        c.redraw()
    });
    if (a && a.length) {
        this.addMarkers(a, false)
    }
}
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m";
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = "png";
MarkerClusterer.prototype.extend = function(b, a) {
    return (function(c) {
        for (property in c.prototype) {
            this.prototype[property] = c.prototype[property]
        }
        return this
    }).apply(b, [a])
};
MarkerClusterer.prototype.onAdd = function() {
    this.setReady_(true)
};
MarkerClusterer.prototype.idle = function() {};
MarkerClusterer.prototype.draw = function() {};
MarkerClusterer.prototype.setupStyles_ = function() {
    for (var b = 0, a; a = this.sizes[b]; b++) {
        this.styles_.push({
            url: this.imagePath_ + (b + 1) + "." + this.imageExtension_,
            height: a,
            width: a
        })
    }
};
MarkerClusterer.prototype.setStyles = function(a) {
    this.styles_ = a
};
MarkerClusterer.prototype.getStyles = function() {
    return this.styles_
};
MarkerClusterer.prototype.isZoomOnClick = function() {
    return this.zoomOnClick_
};
MarkerClusterer.prototype.getMarkers = function() {
    return this.markers_
};
MarkerClusterer.prototype.getTotalMarkers = function() {
    return this.markers_
};
MarkerClusterer.prototype.setMaxZoom = function(a) {
    this.maxZoom_ = a
};
MarkerClusterer.prototype.getMaxZoom = function() {
    return this.maxZoom_ || this.map_.mapTypes[this.map_.getMapTypeId()].maxZoom
};
MarkerClusterer.prototype.calculator_ = function(e, d) {
    var a = 0;
    var c = 0;
    for (i = 0; i < e.length; i++) {
        c += $.data(e[i], "total")
    }
    var b = c;
    while (b !== 0) {
        b = parseInt(b / 10, 10);
        a++
    }
    a = Math.min(a, d);
    return {
        text: c,
        index: a
    }
};
MarkerClusterer.prototype.setCalculator = function(a) {
    this.calculator_ = a
};
MarkerClusterer.prototype.getCalculator = function() {
    return this.calculator_
};
MarkerClusterer.prototype.addMarkers = function(d, c) {
    for (var b = 0, a; a = d[b]; b++) {
        this.pushMarkerTo_(a)
    }
    if (!c) {
        this.redraw()
    }
};
MarkerClusterer.prototype.pushMarkerTo_ = function(a) {
    a.setVisible(false);
    a.setMap(null);
    a.isAdded = false;
    if (a.draggable) {
        var b = this;
        google.maps.event.addListener(a, "dragend", function() {
            a.isAdded = false;
            b.resetViewport();
            b.redraw()
        })
    }
    this.markers_.push(a)
};
MarkerClusterer.prototype.addMarker = function(a, b) {
    this.pushMarkerTo_(a);
    if (!b) {
        this.redraw()
    }
};
MarkerClusterer.prototype.removeMarker = function(b) {
    var c = -1;
    if (this.markers_.indexOf) {
        c = this.markers_.indexOf(b)
    } else {
        for (var d = 0, a; a = this.markers_[d]; d++) {
            if (a == b) {
                c = d;
                continue
            }
        }
    }
    if (c == -1) {
        return false
    }
    this.markers_.splice(c, 1);
    b.setVisible(false);
    b.setMap(null);
    this.resetViewport();
    this.redraw();
    return true
};
MarkerClusterer.prototype.setReady_ = function(a) {
    if (!this.ready_) {
        this.ready_ = a;
        this.createClusters_()
    }
};
MarkerClusterer.prototype.getTotalClusters = function() {
    return this.clusters_.length
};
MarkerClusterer.prototype.getMap = function() {
    return this.map_
};
MarkerClusterer.prototype.setMap = function(a) {
    this.map_ = a
};
MarkerClusterer.prototype.getGridSize = function() {
    return this.gridSize_
};
MarkerClusterer.prototype.setGridSize = function(a) {
    this.gridSize_ = a
};
MarkerClusterer.prototype.getExtendedBounds = function(e) {
    var c = this.getProjection();
    var f = new google.maps.LatLng(e.getNorthEast().lat(), e.getNorthEast().lng());
    var h = new google.maps.LatLng(e.getSouthWest().lat(), e.getSouthWest().lng());
    var d = c.fromLatLngToDivPixel(f);
    d.x += this.gridSize_;
    d.y -= this.gridSize_;
    var b = c.fromLatLngToDivPixel(h);
    b.x -= this.gridSize_;
    b.y += this.gridSize_;
    var g = c.fromDivPixelToLatLng(d);
    var a = c.fromDivPixelToLatLng(b);
    e.extend(g);
    e.extend(a);
    return e
};
MarkerClusterer.prototype.isMarkerInBounds_ = function(a, b) {
    return b.contains(a.getPosition())
};
MarkerClusterer.prototype.clearMarkers = function() {
    this.resetViewport();
    this.markers_ = []
};
MarkerClusterer.prototype.resetViewport = function() {
    for (var c = 0, a; a = this.clusters_[c]; c++) {
        a.remove()
    }
    for (var c = 0, b; b = this.markers_[c]; c++) {
        b.isAdded = false;
        b.setMap(null);
        b.setVisible(false)
    }
    this.clusters_ = []
};
MarkerClusterer.prototype.redraw = function() {
    this.createClusters_()
};
MarkerClusterer.prototype.createClusters_ = function() {
    if (!this.ready_) {
        return
    }
    var c = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(), this.map_.getBounds().getNorthEast());
    var g = this.getExtendedBounds(c);
    for (var e = 0, b; b = this.markers_[e]; e++) {
        var f = false;
        if (!b.isAdded && this.isMarkerInBounds_(b, g)) {
            for (var d = 0, a; a = this.clusters_[d]; d++) {
                if (!f && a.getCenter() && a.isMarkerInClusterBounds(b)) {
                    f = true;
                    a.addMarker(b);
                    break
                }
            }
            if (!f) {
                var a = new Cluster(this);
                a.addMarker(b);
                this.clusters_.push(a)
            }
        }
    }
};

function Cluster(a) {
    this.markerClusterer_ = a;
    this.map_ = a.getMap();
    this.gridSize_ = a.getGridSize();
    this.center_ = null;
    this.markers_ = [];
    this.bounds_ = null;
    this.clusterIcon_ = new ClusterIcon(this, a.getStyles(), a.getGridSize())
}
Cluster.prototype.isMarkerAlreadyAdded = function(b) {
    if (this.markers_.indexOf) {
        return this.markers_.indexOf(b) != -1
    } else {
        for (var c = 0, a; a = this.markers_[c]; c++) {
            if (a == b) {
                return true
            }
        }
    }
    return false
};
Cluster.prototype.addMarker = function(a) {
    if (this.isMarkerAlreadyAdded(a)) {
        return false
    }
    if (!this.center_) {
        this.center_ = a.getPosition();
        this.calculateBounds_()
    }
    a.isAdded = true;
    this.markers_.push(a);
    this.updateIcon();
    return true
};
Cluster.prototype.getMarkerClusterer = function() {
    return this.markerClusterer_
};
Cluster.prototype.getBounds = function() {
    this.calculateBounds_();
    return this.bounds_
};
Cluster.prototype.remove = function() {
    this.clusterIcon_.remove();
    delete this.markers_
};
Cluster.prototype.getCenter = function() {
    return this.center_
};
Cluster.prototype.calculateBounds_ = function() {
    var a = new google.maps.LatLngBounds(this.center_, this.center_);
    this.bounds_ = this.markerClusterer_.getExtendedBounds(a)
};
Cluster.prototype.isMarkerInClusterBounds = function(a) {
    return this.bounds_.contains(a.getPosition())
};
Cluster.prototype.getMap = function() {
    return this.map_
};
Cluster.prototype.updateIcon = function() {
    var e = this.map_.getZoom();
    var f = this.markerClusterer_.getMaxZoom();
    if (e > f) {
        for (var c = 0, a; a = this.markers_[c]; c++) {
            a.setMap(this.map_);
            a.setVisible(true)
        }
        return
    }
    var d = this.markerClusterer_.getStyles().length;
    var b = this.markerClusterer_.getCalculator()(this.markers_, d);
    this.clusterIcon_.setCenter(this.center_);
    this.clusterIcon_.setSums(b);
    this.clusterIcon_.show()
};

function ClusterIcon(a, c, b) {
    a.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);
    this.styles_ = c;
    this.padding_ = b || 0;
    this.cluster_ = a;
    this.center_ = null;
    this.map_ = a.getMap();
    this.div_ = null;
    this.sums_ = null;
    this.visible_ = false;
    this.setMap(this.map_)
}
ClusterIcon.prototype.triggerClusterClick = function() {
    var a = this.cluster_.getMarkerClusterer();
    google.maps.event.trigger(a, "clusterclick", [this.cluster_]);
    if (a.isZoomOnClick() && this.cluster_.markers_.length > 1) {
        this.map_.panTo(this.cluster_.getCenter());
        this.map_.fitBounds(this.cluster_.getBounds())
    } else {
        if (this.cluster_.markers_.length == 1) {
            show_crime_street($(this.cluster_.markers_[0]).data("street"))
        }
    }
};
ClusterIcon.prototype.onAdd = function() {
    this.div_ = document.createElement("DIV");
    if (this.visible_) {
        var c = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(c);
        this.div_.innerHTML = this.sums_.text
    }
    var a = this.getPanes();
    a.overlayImage.appendChild(this.div_);
    var b = this;
    google.maps.event.addDomListener(this.div_, "click", function() {
        b.triggerClusterClick()
    })
};
ClusterIcon.prototype.getPosFromLatLng_ = function(b) {
    var a = this.getProjection().fromLatLngToDivPixel(b);
    a.x -= parseInt(this.width_ / 2, 10);
    a.y -= parseInt(this.height_ / 2, 10);
    return a
};
ClusterIcon.prototype.draw = function() {
    if (this.visible_) {
        var a = this.getPosFromLatLng_(this.center_);
        this.div_.style.top = a.y + "px";
        this.div_.style.left = a.x + "px"
    }
};
ClusterIcon.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.display = "none"
    }
    this.visible_ = false
};
ClusterIcon.prototype.show = function() {
    if (this.div_) {
        var a = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(a);
        this.div_.style.display = ""
    }
    this.visible_ = true
};
ClusterIcon.prototype.remove = function() {
    this.setMap(null)
};
ClusterIcon.prototype.onRemove = function() {
    if (this.div_ && this.div_.parentNode) {
        this.hide();
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null
    }
};
ClusterIcon.prototype.setSums = function(a) {
    this.sums_ = a;
    this.text_ = a.text;
    this.index_ = a.index;
    if (this.div_) {
        this.div_.innerHTML = a.text
    }
    this.useStyle()
};
ClusterIcon.prototype.useStyle = function() {
    var a = Math.max(0, this.sums_.index - 1);
    a = Math.min(this.styles_.length - 1, a);
    var b = this.styles_[a];
    this.url_ = b.url;
    this.height_ = b.height;
    this.width_ = b.width;
    this.textColor_ = b.opt_textColor;
    this.anchor = b.opt_anchor;
    this.textSize_ = b.opt_textSize;
    this.clickable_ = b.opt_clickable
};
ClusterIcon.prototype.setCenter = function(a) {
    this.center_ = a
};
ClusterIcon.prototype.createCss = function(d) {
    var c = [];
    c.push("background:url(" + this.url_ + ");");
    if (typeof this.anchor_ === "object") {
        if (typeof this.anchor_[0] === "number" && this.anchor_[0] > 0 && this.anchor_[0] < this.height_) {
            c.push("height:" + (this.height_ - this.anchor_[0]) + "px; padding-top:" + this.anchor_[0] + "px;")
        } else {
            c.push("height:" + this.height_ + "px; line-height:" + this.height_ + "px;")
        }
        if (typeof this.anchor_[1] === "number" && this.anchor_[1] > 0 && this.anchor_[1] < this.width_) {
            c.push("width:" + (this.width_ - this.anchor_[1]) + "px; padding-left:" + this.anchor_[1] + "px;")
        } else {
            c.push("width:" + this.width_ + "px; text-align:center;")
        }
    } else {
        c.push("height:" + this.height_ + "px; line-height:" + this.height_ + "px; width:" + this.width_ + "px; text-align:center;")
    }
    var a = this.textColor_ ? this.textColor_ : "black";
    var b = this.textSize_ ? this.textSize_ : 11;
    c.push("cursor:pointer; top:" + d.y + "px; left:" + d.x + "px; color:" + a + "; position:absolute; font-size:" + b + "px; font-family:Arial,sans-serif; font-weight:bold");
    return c.join("")
};