// Application Scripts:
// Переключатель языка
// Фикс.хидер на десктопе
// Каталог-меню
// Мобильное меню
// Кнопка скролла страницы
// Слайдер на главной
// Модальное окно
// Маска для телефонного номера
// Галерея в карточке товара

jQuery(document).ready(function ($) {
    //Кэшируем
    var $window = $(window),
        $html=$('html'),
        $body = $('body');

    $body.append('<div id="overlay" class="overlay"></div>');
    var $overlay = $('#overlay');//оверлей

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
    var initPageScroller = (function () {
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
    }());


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
            $modal.hide();
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

    //
    // Маска для телефонного номера
    //---------------------------------------------------------------------------------------
    $('.js-phone').mask('+380 99 999-99-99');

    //
    // Галерея в карточке товара
    //---------------------------------------------------------------------------------------
    function initGallery() {
        var $target = $('.js-gallery-target').find('img'), //картинка в блоке предпросмотра
            index = 0; //индекс картинки в галерее

        $('.js-gallery-large').find('a').lightbox();//натравили лайтбокс на скрытый список крупных изображений

        $('.js-gallery').find('li').filter(':first').find('figure').addClass('active');//добавили класс к первой картинке

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
        initGallery();
    }
    
});
