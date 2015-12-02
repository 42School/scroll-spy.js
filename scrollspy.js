(function($) {
    var Plugin, ScrollSpy, old;
    ScrollSpy = function(element, options) {
        var process;
        process = $.proxy(this.process, this);
        this.$body = $("body");
        this.$scrollElement = ($(element).is("body") ? $(window) : $(element));
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
        this.selector = (this.options.target || "") + " .nav li > a";
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;
        this.$scrollElement.on("scroll.bs.scrollspy", process);
        this.refresh();
        this.process();
    };
    Plugin = function(option) {
        return this.each(function() {
            var $this, data, options;
            $this = $(this);
            data = $this.data("bs.scrollspy");
            options = typeof option === "object" && option;
            if (!data) {
                $this.data("bs.scrollspy", (data = new ScrollSpy(this, options)));
            }
            if (typeof option === "string") {
                data[option]();
            }
        });
    };
    "use strict";
    ScrollSpy.VERSION = "3.3.0";
    ScrollSpy.DEFAULTS = {
        offset: 10
    };
    ScrollSpy.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
    };
    ScrollSpy.prototype.refresh = function() {
        var offsetBase, offsetMethod, self;
        offsetMethod = "offset";
        offsetBase = 0;
        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = "position";
            offsetBase = this.$scrollElement.scrollTop();
        }
        this.offsets = [];
        this.targets = [];
        this.scrollHeight = this.getScrollHeight();
        self = this;
        this.$body.find(this.selector).map(function() {
            var $el, $href, href;
            $el = $(this);
            href = $el.data("target") || $el.attr("href");
            $href = /^#./.test(href) && $(href);
            return ($href && $href.length && $href.is(":visible") && [[$href[offsetMethod]().top + offsetBase, href]]) || null;
        }).sort(function(a, b) {
            return a[0] - b[0];
        }).each(function() {
            self.offsets.push(this[0]);
            self.targets.push(this[1]);
        });
    };
    ScrollSpy.prototype.process = function() {
        var activeTarget, i, maxScroll, offsets, scrollHeight, scrollTop, targets;
        scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
        scrollHeight = this.getScrollHeight();
        maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
        offsets = this.offsets;
        targets = this.targets;
        activeTarget = this.activeTarget;
        i = void 0;
        if (this.scrollHeight !== scrollHeight) {
            this.refresh();
        }
        if (scrollTop >= maxScroll) {
            return activeTarget !== (i = targets[targets.length - 1]) && this.activate(i);
        }
        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null;
            return this.clear();
        }
        i = offsets.length;
        while (i--) {
            activeTarget !== targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i]);
        }
    };
    ScrollSpy.prototype.activate = function(target) {
        var active, selector;
        this.activeTarget = target;
        this.clear();
        selector = this.selector + "[data-target=\"" + target + "\"]," + this.selector + "[href=\"" + target + "\"]";
        active = $(selector).parents("li").addClass("active");
        if (active.parent(".dropdown-menu").length) {
            active = active.closest("li.dropdown").addClass("active");
        }
        active.trigger("activate.bs.scrollspy");
    };
    ScrollSpy.prototype.clear = function() {
        $(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
    };
    old = $.fn.scrollspy;
    $.fn.scrollspy = Plugin;
    $.fn.scrollspy.Constructor = ScrollSpy;
    $.fn.scrollspy.noConflict = function() {
        $.fn.scrollspy = old;
        return this;
    };
    $(window).on("load.bs.scrollspy.data-api", function() {
        $("[data-spy=\"scroll\"]").each(function() {
            var $spy;
            $spy = $(this);
            Plugin.call($spy, $spy.data());
        });
    });
})(jQuery);