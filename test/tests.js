/*global
 $, QUnit
 */

(function () {

    "use strict";

    QUnit.config.testTimeout = 2000;

    var imageUrl = 'lazy.jpg',
        unusedUrl = 'unused.jpg',
        debug = true,
        uniqueImageUrl = function () {
            return 'lazy.jpg?t=' + new Date().getTime();
        };

    function createScrollableContainer () {
        return $('<div class="scrollable-container"><div class="content"></div></div>');
    }

    function createLazyImage (className) {
        return $('<img/>')
            .addClass('lazy ' + className)
            .attr('data-src', uniqueImageUrl());
    }

    QUnit.module("Unveil tests", {
        beforeEach: function () {
            $('body').prepend('<div id="testContainer"></div>');
        },
        afterEach: function () {
            $('#testContainer').remove();
        }
    });

    QUnit.test("Basic test", function (assert) {
        // Some basic tests if initial behaviour is consistent
        assert.equal(typeof $.fn.unveil, 'function', 'Unveil should be loaded');
        assert.equal($('').unveil().length, 0, 'Unveil without arguments should return empty array');
        assert.equal($('<div/>').unveil()[0].nodeName, 'DIV', 'Unveil with div should just return the DIV');
    });

    QUnit.test("Single image test", function (assert) {
        var done = assert.async(1);
        var image = $('<img/>')
            .addClass('lazy topleft')
            .attr('src', uniqueImageUrl())
            .appendTo('#testContainer');

        $(image).unveil({
            debug: debug,
            loaded: function () {
                assert.ok(image.prop('src').indexOf(imageUrl) > -1, 'Image source should be set');
                done();
            }
        });
    });

    QUnit.test("Single image with data-src test", function (assert) {
        var done = assert.async(1);
        var image = $('<img/>')
            .addClass('lazy topleft')
            .attr('data-src', uniqueImageUrl())
            .appendTo('#testContainer');

        $(image).unveil({
            debug: debug,
            loaded: function () {
                assert.ok(image.prop('src').indexOf(imageUrl) > -1, 'Image source should now be set');
                done();
            }
        });
    });

    QUnit.test("Custom attribute source test", function (assert) {
        var done = assert.async(1);
        var image = $('<img/>')
            .addClass('lazy')
            .attr('data-custom', uniqueImageUrl())
            .appendTo('#testContainer');

        image.on('loaded.unveil', function () {
            assert.ok(image.prop('src').indexOf(imageUrl) > -1, 'Image source should now be set');
            done();
        });

        $(image).unveil({
            attribute: 'custom',
            debug: debug
        });
    });

    QUnit.test("Placeholder test", function (assert) {
        var done = assert.async(1);
        var image = $('<img/>')
            .addClass('lazy topleft')
            .attr('src', uniqueImageUrl())
            .attr('data-src-placeholder', unusedUrl)
            .appendTo('#testContainer');

        $(image).unveil({
            debug: debug,
            loaded: function () {
                assert.ok(image.prop('src').indexOf(imageUrl) > -1, 'Image source should now be set');
                done();
            }
        });

        assert.ok(image.prop('src').indexOf(unusedUrl) > -1, 'Placeholder should now be set');
    });

    QUnit.test("Scroll test", function (assert) {
        var done = assert.async(1);
        var image = $('<img/>')
            .addClass('lazy waydown')
            .attr('data-src', uniqueImageUrl())
            .appendTo('#testContainer');

        $(image).unveil({
            debug: debug,
            loaded: function () {
                assert.ok(image.prop('src').indexOf(imageUrl) > -1, 'Image source should now be set');
                $(window).scrollTop(0);
                done();
            }
        });

        assert.ok(image.prop('src').indexOf(imageUrl) === -1, 'Image source should not be set');
        $(window).scrollTop(2000).trigger('scroll');
    });

    QUnit.test("Custom container test", function (assert) {
        var done = assert.async(1);
        var customContainer = $('<div></div>')
            .addClass('scrollable-container')
            .append('<div class="content"></div>')
            .appendTo('#testContainer');
        var image = $('<img height="200" width="200"/>')
            .addClass('lazy content-img-bottom')
            .attr('data-src', uniqueImageUrl())
            .appendTo('.content');

        var options = {
            debug: debug,
            offset: 200,
            container: customContainer
        };
        var preloadingHeight = customContainer.find('.content').height() - options.offset - image.height() - customContainer.height() - 1;
        customContainer.scrollTop(preloadingHeight);
        $(image).unveil(options);
        assert.ok(image.prop('src').indexOf(imageUrl) === -1, 'Image source should not be set');

        image.on('loaded.unveil', function () {
            assert.ok(image.prop('src').indexOf(imageUrl) > -1, 'Image source should now be set');
            done();
        });
        customContainer.scrollTop(preloadingHeight + 1);
    });

    QUnit.test("Retina image test", function (assert) {
        var done = assert.async(1);
        var image = $('<img/>')
            .addClass('lazy topleft')
            .attr('data-src', 'unused.jpg|' + uniqueImageUrl())
            .appendTo('#testContainer');

        $(image).unveil({
            debug: debug,
            retina: true,
            loaded: function () {
                assert.ok(image.prop('src').indexOf(imageUrl) > -1, 'Image source should now be set');
                done();
            }
        });
    });

    QUnit.test("Background image test", function (assert) {
        var done = assert.async(1);
        var header = $('<header/>')
            .addClass('lazy topleft')
            .attr('data-src', uniqueImageUrl())
            .appendTo('#testContainer');

        $(header).unveil({
            debug: debug,
            loaded: function () {
                assert.ok(header.css('backgroundImage').indexOf(imageUrl) > -1, 'DIV background-url should now be set');
                done();
            }
        });
    });

    QUnit.test("Classes test", function (assert) {
        assert.expect(2);
        var done1 = assert.async(),
            done2 = assert.async(),
            image = $('<img/>')
                .addClass('lazy topleft')
                .attr('src', uniqueImageUrl())
                .appendTo('#testContainer');

        $(image).unveil({
            debug: debug,
            loading: function () {
                assert.ok(image.hasClass('unveil-loading'), 'Loading class should be set');
                done1();
            },
            loaded: function () {
                assert.ok(image.hasClass('unveil-loaded'), 'Loaded class should be set');
                done2();
            }
        });
    });

    QUnit.module("Multiple container", function (hooks) {
        var container1;
        hooks.beforeEach(function () {
            container1 = createScrollableContainer();
            container1.find('.content').append(createLazyImage('content-img-bottom'));
            container1.appendTo('#testContainer');
        });

        QUnit.test("Scroll on window does not reveal custom container", function(assert) {
            var done = assert.async(1);

            var windowContent = $('<div class="content"></div>');
            $('#testContainer').append(windowContent);
            $(window).scrollTop(windowContent.height());

            var lazyImages = container1.find('.lazy');
            lazyImages.on('loaded.unveil', function () {
                assert.ok(false, 'Image source should not be set');
                done();
            });
            lazyImages.find('.lazy').unveil({
                debug: debug,
                container: container1
            });

            assert.ok(lazyImages.prop('src').indexOf(imageUrl) === -1, 'Image source should not be set');
            setTimeout(done, 0);
        });

        QUnit.test("Scroll on container1 does not reveal container2", function(assert) {
            var done = assert.async(1);

            var container2 = createScrollableContainer();
            container2.find('.content').append(createLazyImage('content-img-bottom'));
            container2.appendTo('#testContainer');

            $(container1).scrollTop(container1.find('.content').height());

            var lazyImages = container2.find('.lazy');
            lazyImages.on('loaded.unveil', function () {
                assert.ok(false, 'Image source should not be set');
                done();
            });
            lazyImages.unveil({
                debug: debug,
                container: container2
            });
            container1.find('.lazy').unveil({container: container1});

            assert.ok(lazyImages.prop('src').indexOf(imageUrl) === -1, 'Image source should not be set');
            setTimeout(done, 0);
        });
    });

    QUnit.test("Destroy container", function (assert) {
        var done = assert.async();
        var container = createScrollableContainer();
        var topImage = createLazyImage('content-img-top');
        var bottomImage = createLazyImage('content-img-bottom');
        var containerContent = container.find('.content');
        containerContent.append(topImage);
        containerContent.append(bottomImage);
        container.appendTo('#testContainer');

        var lazyImages = container.find('.lazy');
        lazyImages.unveil({
            debug: debug,
            container: container
        });

        setTimeout(function () {
            assert.ok(topImage.prop('src').indexOf(imageUrl) > -1, 'Top image source should now be set');
            lazyImages.trigger('destroy.unveil');
            container.scrollTop(containerContent.height()).trigger('scroll');
            setTimeout(function() {
                assert.ok(bottomImage.prop('src').indexOf(imageUrl) === -1, 'Bottom image source should not be set');
                bottomImage.on('loaded.unveil', function() {
                    assert.ok(bottomImage.prop('src').indexOf(imageUrl) > -1, 'Bottom image source should now be set');
                    done();
                });
                lazyImages.unveil({
                    debug: debug,
                    container: container
                });
            }, 0);
        }, 200);
    })
}());