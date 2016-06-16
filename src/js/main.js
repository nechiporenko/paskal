// Application Scripts:

// Переключатель языка
// Фикс.хидер на десктопе
// Каталог-меню
// Мобильное меню
// Кнопка скролла страницы
// Слайдер на главной

// Модальное окно
// клик по кнопке с атрибутом data-modal - открываем модальное окно
// покажем модальное окно после добавления товара в корзину

// Маска для телефонного номера
// Галерея в карточке товара
// Стилизуем таблицы в описании товара
// Слайдеры товаров
// Покажем / спрячем фильтр в каталоге
// Вкладки
// Фотогалерея
// Видеогалерея
// Поле для ввода кол-ва товаров
// Страница корзины товаров
// Покажем / скроем поле "Компания" при клике по радио-кнопке при оформлении заказа

jQuery(document).ready(function ($) {
    //Кэшируем
    var $window = $(window),
        $html=$('html'),
        $body = $('body');

    $body.append('<div id="overlay" class="overlay"></div>');
    var $overlay = $('#overlay');//оверлей

    var lightboxOptions = {//общие настройки для лайтбокса в фотогалереи и карточке товара
        navText: ['<i class="icon-left-open-big"></i>', '<i class="icon-right-open-big"></i>'],
        captions: true,
        captionSelector: 'self',
        captionType: 'data',
        captionsData: 'caption',
        close: true,
        closeText: '<i class="icon-cancel"></i>',
        showCounter: false,
        disableScroll: false
    };

    //
    // Переключатель языка
    //---------------------------------------------------------------------------------------
    (function () {
        var $switcher = $('.js-lang'),
            $btn = $switcher.find('.js-lang-btn'),
            $list = $switcher.find('ul'),
            method = {};

        method.hideMenu = function () {
            $btn.removeClass('active');
            $list.hide();
            $body.unbind('click', method.hideMenu);
        };

        method.showMenu = function () {
            $btn.addClass('active');
            $list.fadeIn();
            $switcher.mouseleave(function () {
                $body.bind('click', method.hideMenu);
            }).mouseenter(function () {
                $body.unbind('click', method.hideMenu);
            });
        };
        $switcher.on('click', '.js-lang-btn', function () {
            if ($(this).hasClass('active')) {
                method.hideMenu();
            } else {
                method.showMenu();
            }
        });
    })();

    //
    // Фикс.хидер на десктопе
    //---------------------------------------------------------------------------------------
    (function () {
        var sticky,
            winW,
            isStick = false, //флаг состояния
            rtime, //переменные для пересчета ресайза окна с задержкой delta
            timeout = false,
            delta = 200,
            method = {};

        method.init = function () {
            sticky = new Waypoint.Sticky({
                element: $('.b-header__inner')[0]
            });
            isStick = true;
        };
        
        method.destroy = function () {
            sticky.destroy();
            isStick = false;
        };

        method.check = function () {
            winW = $.viewportW();
            if (winW >= 992 && !isStick) {//если десктоп и "стикер" не запущен
                method.init(); //запускаем
            };
            if (winW < 992 && isStick) {//если мелкий экран и "стикер" работает
                method.destroy(); //вырубаем
            }
        };

        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.check();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        

        method.check(); //проверяем при загрузке

        $window.bind('resize', method.startResize); //начинаем отслеживать ресайз окна

    })();

    //
    // Каталог-меню
    //---------------------------------------------------------------------------------------
    (function () {
        var $menu = $('.js-menu'),
            $submenu = $menu.children('li').children('ul'),//берем только 1-й уровень вложений (возможно, добавиттся 2-й когда-нибудь)
            $btn = $menu.children('li').children('a'),
            method = {};

        method.hideAll = function () {//при клике по заголовку не активного меню, сперва спрячем все субменю
            var winW = $.viewportW();//ширина окна браузера
            $btn.removeClass('active');
            if (winW >= 640) {
                $submenu.hide();
            } else {//на маленьком экране - эффект аккордеона - сворачиваем
                $submenu.slideUp(200);
            };
            $body.unbind('click', method.hideAll);
        };

        method.hide = function (el, target) {//клик по заголовку открытого меню
            target.slideUp(200);
            el.removeClass('active');
            $body.unbind('click', method.hideAll);
        };

        method.show = function (el, target) {//открываем субменю
            target.slideDown(200);
            el.addClass('active');

            $menu.mouseleave(function () {
                $body.bind('click', method.hideAll);
            }).mouseenter(function () {
                $body.unbind('click', method.hideAll);
            });
        };

        method.click = function (e) {//обрабатываем клик
            e.preventDefault();
            var $el=$(this),
                $target = $el.parent('li').find('ul:first');
            if ($el.hasClass('active')) {
                method.hide($el, $target);
            } else {
                method.hideAll();
                method.show($el, $target);
            };
        };

        $btn.bind('click', method.click); //начинаем отслеживать клик по заголовкам


        $menu.children('li').hover(function () {//на десктопе будем показывать субменю при наведении мышки
            var winW = $.viewportW();//ширина экрана
            if (winW >= 1200) {
                method.hideAll(); //чтобы не осталось субменю, открытых на предыдущем маленьком разрешении, например
                $btn.unbind('click', method.click);//отключаем обработку клика - делаем заголовок кликабельным
                $(this).children('a').addClass('active').next('ul:first').fadeIn(200);
            };
        }, function () {
            var winW = $.viewportW();
            if (winW >= 1200) {
                $(this).children('a').removeClass('active').next('ul:first').hide();
                $btn.bind('click', method.click);
            }
        });

    })();

    //
    // Мобильное меню
    //---------------------------------------------------------------------------------------
    (function () {
        var $btn = $('.js-mmenu-toggle'),
            $menu = $('.js-mmenu'),
            method = {};

        method.hideMenu = function () {
            $btn.removeClass('active');
            $menu.removeClass('active');
            $html.css('overflow', 'auto');
            $overlay.unbind('click', method.hideMenu).hide();
        };

        method.showMenu = function () {
            $btn.addClass('active');
            $menu.addClass('active');
            $html.css('overflow', 'hidden');
            $overlay.show().bind('click', method.hideMenu);
        }

        $('.b-header__menu').on('click', '.js-mmenu-toggle', function () {//покажем - спрячем
            if ($(this).hasClass('active')) {
                method.hideMenu();
            } else {
                method.showMenu();
            }
        });

        $menu.on('click', '.m-menu__label', method.hideMenu); //закроем по клику по заголовку
    })();

    //
    // Кнопка скролла страницы
    //---------------------------------------------------------------------------------------
    (function () {
        var $scroller = $('<div class="scroll-up-btn"><i class="icon-up-open-big"></i></div>');
        $body.append($scroller);
        $window.on('scroll', function () {
            if ($(this).scrollTop() > 300) {
                $scroller.show();
            } else {
                $scroller.hide();
            }
        });
        $scroller.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false;
        });
    })();

    //
    // Слайдер на главной
    //---------------------------------------------------------------------------------------
    function initMainSlider() {
        var $slider = $('.js-slider');
        $slider.bxSlider({
            pager: false,
            mode: 'fade',
            auto: true,
            pause: 8000
        });
    };
    if ($('.js-slider').length) { initMainSlider();}

    //
    // Модальное окно
    //---------------------------------------------------------------------------------------
    var showModal = (function (link) {
        var
        method = {},
        $modal,
        $close;

        $close = $('<a class="modal__close" href="#"><i class="icon-cancel"></i></a>'); //иконка закрыть


        $close.on('click', function (e) {
            e.preventDefault();
            method.close();
        });

        // центрируем окно
        method.center = function () {
            var top, left;

            top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
            left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;

            $modal.css({
                top: top + $window.scrollTop(),
                left: left + $window.scrollLeft()
            });
        };


        // открываем
        method.open = function (link) {
            $modal = $(link);
            $modal.append($close);
            method.center();
            $window.bind('resize.modal', method.center);
            $modal.show();
            $overlay.show().bind('click', method.close);
        };

        // закрываем
        method.close = function () {
            $modal.hide().find('iframe').attr('src', '');//если в модальном окне было видео - убъем
            $overlay.hide().unbind('click', method.close);
            $window.unbind('resize.modal');
        };

        return method;
    }());

    // клик по кнопке с атрибутом data-modal - открываем модальное окно
    $('[data-modal]').on('click', function (e) {//передаем айди модального окна
        e.preventDefault();
        var link = $(this).data('modal');
        if (link) { showModal.open(link); }
    });

    // покажем модальное окно после добавления товара в корзину
    $('.product-info').on('click', '.product-info__btn', function () {
        showModal.open('#add_to_basket'); //#add_to_basket - id модального окна
    });

    //
    // Маска для телефонного номера
    //---------------------------------------------------------------------------------------
    $('.js-phone').mask('+380 99 999-99-99');

    //
    // Галерея в карточке товара
    //---------------------------------------------------------------------------------------
    function initProductGallery() {
        var $target = $('.js-gallery-target').find('img'), //картинка в блоке предпросмотра
            $el=$('.js-gallery').children('li'), //превьюшки галереи
            index = 0; //индекс картинки в галерее

        $('.js-gallery-large').find('a').simpleLightbox(lightboxOptions);//натравили лайтбокс на скрытый список крупных изображений

        $el.filter(':first').find('figure').addClass('active');//добавили класс к первой превьюшке
        if ($el.length > 4) {//если более 4 превьюшек - запустим их в слайдере
            $('.js-gallery').wrap('<div class="product-thumb-slider"></div>').bxSlider({
                minSlides: 4,
                maxSlides: 4,
                moveSlides: 1,
                slideWidth: 110,
                auto: false,
                pager: false,
                infiniteLoop: false,
                hideControlOnEnd: true,
                useCSS: false,
            });
        };

        $('.js-gallery').on('click', 'figure', function () {//клик по превьюшке - изменим картинку в блоке предпросмотра
            var $el = $(this);
            if ($el.hasClass('active')) {
                return false;
            } else {
                var src = $el.data('img');//взяли картинку среднего размера
                if (src) {
                    $('.js-gallery figure').removeClass('active');
                    $el.addClass('active');
                    $target.attr('src', src);//отправили в блок предпросмотра
                    index = $(this).parent('li').index();//изменили индекс
                };
            };
        });

        $('.js-gallery-target').on('click', function () {
            $('.js-gallery-large li').eq(index).children('a').click();//откроем большую картиеку в лайтбоксе
        });
    }

    if ($('.js-gallery').length > 0) {
        initProductGallery();
    }

    //
    // Стилизуем таблицы в описании товара
    //---------------------------------------------------------------------------------------
    $('#product_description').find('table').each(function () {
        var $el = $(this);
        $el.addClass('g-table g-text-center');
        if ($el.parent('div').hasClass('g-table-wrap')) {//если есть обертка
            return;
        } else {//если нет "обертки"
            var border = +$el.attr('border');//если нужно сделать таблицу с оазделителями
            if (border > 0) {
                $el.removeAttr('border').addClass('g-table--bordered');
                $el.wrap('<div class="g-table-wrap"></div>');
            } else {
                $el.wrap('<div class="g-table-wrap g-table-wrap--bordered"></div>');
            }
            
        };
    });

    //
    // Слайдеры товаров
    //---------------------------------------------------------------------------------------
    function initProductSlider(el) {
        var $slider = el,
            rtime, //переменные для пересчета ресайза окна с задержкой delta
            timeout = false,
            delta = 200,
            method = {};

        method.getSliderSettings = function () {
            var setting,
                    settings1 = {
                        maxSlides: 1,
                        minSlides: 1,
                    },
                    settings2 = {
                        maxSlides: 2,
                        minSlides: 2,
                    },
                    settings3 = {
                        maxSlides: 3,
                        minSlides: 3,
                    },
                    settings4 = {
                        maxSlides: 4,
                        minSlides: 4,
                    },
                    common = {
                        slideWidth: 222,
                        slideMargin: 24,
                        moveSlides: 1,
                        auto: false,
                        pager: false,
                        mode: 'horizontal',
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        useCSS: false,
                    },
                    winW = $.viewportW();
            if (winW < 550) {
                setting = $.extend(settings1, common);
            }
            if (winW >= 550 && winW <= 800) {
                setting = $.extend(settings2, common);
            }
            if (winW >= 800 && winW <= 1200) {
                setting = $.extend(settings3, common);
            }
            if (winW > 1200) {
                setting = $.extend(settings4, common);
            }
            return setting;
        };

        method.reloadSliderSettings = function () {
            $slider.reloadSlider($.extend(method.getSliderSettings(), { startSlide: $slider.getCurrentSlide() }));
        };

        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.reloadSliderSettings();
            }
        }

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        }

        $slider.bxSlider(method.getSliderSettings());//запускаем слайдер

        $window.bind('resize', method.startResize);//пересчитываем кол-во видимых элементов при ресайзе окна с задержкой .2с
    };

    if ($('.js-product-slider1').length) { initProductSlider($('.js-product-slider1')); }
    if ($('.js-product-slider2').length) { initProductSlider($('.js-product-slider2')); }



    //
    // Покажем / спрячем фильтр в каталоге
    //---------------------------------------------------------------------------------------
    function collapseFilter() {
        var $btn = $('.js-filter-btn'),
            $filter = $btn.nextAll('.js-filter-target');
        $btn.on('click', function () {
            if ($btn.hasClass('active')) {
                $btn.removeClass('active');
                $filter.slideDown(400);
            } else {
                $btn.addClass('active');
                $filter.slideUp(400);
            }
        });
    };
    if ($('.js-filter-btn').length) {
        collapseFilter();
    }

    //
    // Вкладки
    //---------------------------------------------------------------------------------------
    function initTabs() {
        var $list = $('.js-tabs'),
            $content = $('.js-tabs-content > div'),
            method = {};

        method.init = (function () {//спрячем "лишние" вкладки
            $content.hide()
            $list.each(function () {
                var current = $(this).find('li.current');
                if (current.length < 1) { $(this).find('li:first').addClass('current'); }
                current = $(this).find('li.current a').attr('href');
                $(current).show();
            });
        })();

        method.show = function (el) {//обработка клика по вкладке
            var $tabs = el.parents('ul').find('li');
            var tab_next = el.attr('href');
            var tab_current = $tabs.filter('.current').find('a').attr('href');
            $(tab_current).hide();
            $tabs.removeClass('current');
            el.parent().addClass('current');
            $(tab_next).fadeIn();
            history.pushState(null, null, window.location.search + el.attr('href'));
        };


        $list.on('click', 'a[href^="#"]', function (e) {//клик по вкладке
            e.preventDefault();
            method.show($(this));
        });

        method.parsing = (function () {//парсим линк и открываем нужную вкладку при загрузке
            var hash = window.location.hash;
            if (hash) {
                var selectedTab = $list.find('a[href="' + hash + '"]');
                selectedTab.trigger('click', true);
            };
        })();
    };
    if ($('.js-tabs').length) { initTabs(); }

    // Фотогалерея
    $('.js-photogallery a').simpleLightbox(lightboxOptions);

    //
    // Видеогалерея
    //---------------------------------------------------------------------------------------
    $('.js-videogallery').on('click', 'a', function (e) {
        e.preventDefault();
        var link = $(this).attr('href'),
            id = getYoutubeID(link);

        if (id) {
            $('#videomodal').find('iframe').attr('src', 'https://www.youtube.com/embed/' + id + '?rel=0&amp;showinfo=0;autoplay=1');
            showModal.open('#videomodal');
        }

        function getYoutubeID(url) {//парсим youtube-ссылку, возвращаем id видео
            var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp),
                urllink;
            if (match && match[1].length == 11) {
                urllink = match[1];
            } else {
                urllink = false;
            }
            return urllink;
        }
    });

   
    //
    // Поле для ввода кол-ва товаров
    //---------------------------------------------------------------------------------------
    $('.js-number-input').on('keydown', function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        };
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        };
    }).on('change', function () {
        var num = $(this).val();
        num = Math.round(num);

        if (num <= 0) {
            num = 1;
        };

        if (num > 1000) {
            num = 999;
        };

        $(this).val(num);
    });

    //
    // Страница корзины товаров
    //---------------------------------------------------------------------------------------
    function recalcCart() {
        var $cart = $('.js-cart'),
            $cartcount = $('#cartcount'),
            $total = $cart.find('.js-total-price'),
            method = {};

        method.recalc = function () {
            var total_count = 0,
                total_price = 0;
            $cart.find('tbody tr').each(function () {
                var price = + $(this).find('.js-price').text(),
                    count = + $(this).find('.js-number-input').val(),
                    item_price = count * price;
                total_count = total_count + count;
                total_price = total_price + item_price;
                $(this).find('.js-total').text(item_price);
            });

            $total.text(total_price);
            $cartcount.text(total_count);

            if (total_count === 0) {
                method.empty();//если нет товаров в корзине
            }
        };

        method.delete = function (el) {
            var $row = el.parents('tr');
            $row.remove();
            method.recalc();
        };

        method.empty = function () {//если нет товаров в корзине
            $('.js-checkout-btn').prop('disabled', true);
            $('.js-empty-cart').removeClass('g-hidden');
            $('.b-cartlink').removeClass('active');
        };

        method.recalc();//проверим сумму при загрузке страницы

        $cart.on('change', '.js-number-input', method.recalc);//обновляем цену при изм.кол-ва товаров
        $cart.on('click', '.js-delete', function () {//удаляем строку таблицы
            var $el = $(this);
            method.delete($el);
        });
    };

    if ($('.js-cart').length > 0) {
        recalcCart();
    };

    //
    // Покажем / скроем поле "Компания" при клике по радио-кнопке при оформлении заказа
    //---------------------------------------------------------------------------------------
    $('#checkout').find('input[type=radio][name=payment]').on('change', function () {
        var $target = $('#additional_field');
        if ($(this).val() === 'individual') {
            $target.addClass('g-hidden').find('input[type=text]').prop('required', false);
        } else if ($(this).val() === 'company') {
            $target.removeClass('g-hidden').find('input[type=text]').prop('required', true);
        }
    });
});
