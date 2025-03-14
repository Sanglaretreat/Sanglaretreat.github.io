'use strict';
$(document).ready(function() {

    /*-----------------------------------------------------------------
      01. Detect device mobile
    -------------------------------------------------------------------*/
	
    var isMobile = false; 
    if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('html').addClass('touch');
        isMobile = true;
	
    }
    else {
        $('html').addClass('no-touch');
        isMobile = false;
    }
    
	//IE, Edge
	var isIE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d+/.test(navigator.userAgent);
  
    /*-----------------------------------------------------------------
      02. Preloader
    -------------------------------------------------------------------*/

    anime({
        targets: 'body',
        opacity: 1,
        delay: 260,
        complete: function(anim) {
            tween(); //Init animations
		    sliders(); //Init sliders
		    counter(); //Init counter homepage
		    progressBar(); //Init progress bar
        }
    });
    
    $('body, .js-img-load').imagesLoaded({ background: !0 }).always( function( instance ) {
	    preloader(); //Init preloader
    });

    function preloader() {
        var tl = anime.timeline({
            complete: function(anim) {
                $('body').removeClass('no-scroll');
            }    
        });
           
        tl
        .add({
            targets: 'body',
            duration: 1,
            update: function() {
                //$('body').addClass('no-scroll');
            }
        })
        .add({
            targets: '.preloader',
            delay: 1000,
            duration: 1000,
            opacity: 0,
            zIndex: '-1',
            easing: 'easeInOutQuart'
        });
    };

    /*-----------------------------------------------------------------
      03. Hamburger
    -------------------------------------------------------------------*/

    $('.hamburger').on('click', function() {
        $(this).toggleClass('is-active');
        $('html').toggleClass('is-scroll-disabled');
    });
  
    /*-----------------------------------------------------------------
      04. Toggle Navbar
    -------------------------------------------------------------------*/
    
	$('.sticky').each(function() {
        var nav = $('.sticky'),
            body = $('body'),
            windowScreen = $(window),
            navOffset = nav.offset().top,
            previousScroll = 0;
    
        if (windowScreen.scrollTop() >= navOffset && !nav.hasClass('is-sticky')) {
            nav.addClass('is-sticky');
            //$(body).css({paddingTop : nav.css('height')});
        }
	
        $(window).on('scroll', function () {
            if (windowScreen.scrollTop() >= navOffset && !nav.hasClass('is-sticky')) {
                nav.addClass('is-sticky');
                //$(body).css({paddingTop : nav.css('height')});
            }
        
            if (windowScreen.scrollTop() < navOffset && nav.hasClass('is-sticky')) {
                nav.removeClass('is-sticky');
                //$(body).css({paddingTop : 0});
            }
        
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                window.console.log('done');
            }
            var newScroll = $(this).scrollTop();
			
            if (newScroll > navOffset && newScroll < $(document).height() - $(window).height()) {
                if (newScroll > previousScroll) {
                    nav.addClass('hide').removeClass('show');
                } else {
                    nav.addClass('show').removeClass('hide');
                }
                previousScroll = newScroll;
            }
        });
	});

    /*-----------------------------------------------------------------
      05. Mobile Nav
    -------------------------------------------------------------------*/
  
    var sideNavOpen = $('.hamburger');
    var mobileNavTl = anime.timeline({autoplay: false});

    $('.navbar').each(function(i) {
        mobileNavTl
        .add({
            targets: 'body',
            duration: 1
        })    
        .add({
            targets: '.nav',
            duration: 500,
            easing: 'easeInOutCirc'
        })
        .add({
            targets: '.nav__item',
            duration: 200,
            delay: anime.stagger(50),
            opacity: [0, 1],
            translateX: [70, 0],
            easing: 'easeInOutBack'
        },'-=180');
    });

    $(sideNavOpen).on('click', function(e) {
        e.preventDefault();
        if (mobileNavTl.began) {
            mobileNavTl.reverse()
            mobileNavTl.completed = false;
            
        }
        if (mobileNavTl.paused) {
            mobileNavTl.play()
        }
        $('.nav').toggleClass('is-active');
        $('body').toggleClass('open-nav');
    });

    /*-----------------------------------------------------------------
      06. Mobile Bottom Nav
    -------------------------------------------------------------------*/
  
    $('.bottom-nav__control').on('click', function() {
        $('.bottom-nav').toggleClass('open');
        $('html').toggleClass('no-scroll overlay-visible');
		if (isMobile) {
		    $('body').toggleClass('no-scroll-ios');
		}
    });
	
	
    /*-----------------------------------------------------------------
      07. Slider price
    -------------------------------------------------------------------*/
	
	function rangePrice(){
        var sliderPrice = document.getElementById('priceRange');
        
		if (sliderPrice) {
		    var priceFormat = wNumb({
                decimals: 0,
			    mark: '.',
		        prefix: '$ '
            });
        
            noUiSlider.create(sliderPrice, {
	            start: [49, 129],
	            step: 1,
	            connect: true,
			    format: priceFormat,
	            range: {
		            'min': [49],
		            'max': [259]
	            }
            });
		
		    var priceViewFrom = document.getElementById('price-from'),
			    priceViewTo = document.getElementById('price-to'),
				priceView = [priceViewFrom, priceViewTo],
			    inputPriceMin = document.getElementById('price-min'),
		        inputPriceMax = document.getElementById('price-max'),
		        inputs = [inputPriceMin, inputPriceMax];
		
		        sliderPrice.noUiSlider.on('update', function(values, handle) {
			        inputs[handle].value = values[handle];
					priceView[handle].innerHTML = values[handle];
                });

                inputs.forEach(function (input, handle) {
			        input.addEventListener('change', function () {
                    sliderPrice.noUiSlider.setHandle(handle, this.value);
                });
		    });
		}
    }

    rangePrice();
	
	
    /*-----------------------------------------------------------------
      08. Input quantity
    -------------------------------------------------------------------*/
	
    function quantityInput(){
	    if ($('.js-quantity').length){
		    $('.js-quantity').each(function () {
			    var inst = $(this),
				    input = inst.find('.js-quantity-input'),
				    quantityUp = inst.find('.qty-plus'),
				    quantityDown = inst.find('.qty-minus'),
				    min = input.attr( 'min' ),
				    max = input.attr( 'max' );

			    quantityUp.on('click', function () {
				    var oldValue = parseFloat(input.val());
				    if (oldValue >= max) {
					    var newVal = oldValue;
				    } else {
					    var newVal = oldValue + 1;
				    }
				    inst.find('.js-quantity-input').val(newVal);
				    inst.find('.js-quantity-input').trigger('change');
			    });

			    quantityDown.on('click', function () {
				    var oldValue = parseFloat(input.val());
				    if (oldValue <= min) {
					    var newVal = oldValue;
				    } else {
					    var newVal = oldValue - 1;
				    }
				    inst.find('.js-quantity-input').val(newVal);
				    inst.find('.js-quantity-input').trigger('change');
			    });
		    });
	    }
    }

    quantityInput();
	
	
    /*-----------------------------------------------------------------
      09. Input readonly
    -------------------------------------------------------------------*/
	
    $('.readonly').on('keydown paste', function(e){
        e.preventDefault();
    });
	

    /*-----------------------------------------------------------------
      10. Form settings
    -------------------------------------------------------------------*/
	
	// Calculation
	$('#person-adult, #person-kids').on('change', function(){
        var ret = Number($('#person-adult').val()) + Number($('#person-kids').val());
        $('#person-total').val(ret + ' persons');
    });
	
	// Clear persons form
	$('.btn-reset-persons').on('click', function(){
        $('#person-adult').val('1');
		$('#person-kids').val('0');
		$('#person-total').val(1 + ' persons');
    });
	
	// Close dropdown
    $('.btn-close-dropdown').on('click', function(){
        $('.closeDropdown').dropdown("toggle");
    });
	
	
    /*-----------------------------------------------------------------
      11. DatePicker
    -------------------------------------------------------------------*/
	
	$('.js-datepicker').each(function() {
        if (!isMobile) {
            $('.js-datepicker').flatpickr({
                dateFormat: 'd M y',
		        //minDate: 'today',
		        closeOnSelect: false,
		        allowInput: true,
		        position: 'auto',
		        monthSelectorType: 'static',
                yearSelectorType: 'static',
		        nextArrow: '<svg viewBox="0 0 32 32"><path fill-rule="evenodd" d="M32 16c0-8.83656-7.1634-16-16-16C7.16344 0 0 7.16344 0 16c0 8.8366 7.16344 16 16 16 8.8366 0 16-7.1634 16-16zM16 31c8.2843 0 15-6.7157 15-15 0-8.28427-6.7157-15-15-15C7.71573 1 1 7.71573 1 16c0 8.2843 6.71573 15 15 15z" clip-rule="evenodd" opacity=".2"/><path d="M15.4697 13.0303c-.2929-.2929-.2929-.7677 0-1.0606.2929-.2929.7677-.2929 1.0606 0l3.5 3.5c.2929.2929.2929.7677 0 1.0606l-3.5 3.5c-.2929.2929-.7677.2929-1.0606 0-.2929-.2929-.2929-.7677 0-1.0606l2.2196-2.2197H12.5c-.4142 0-.75-.3358-.75-.75s.3358-.75.75-.75h5.1893l-2.2196-2.2197z"/></svg>',
                prevArrow: '<svg viewBox="0 0 32 32"><path fill-rule="evenodd" d="M0 16C0 7.16344 7.16344 0 16 0c8.8366 0 16 7.16344 16 16 0 8.8366-7.1634 16-16 16-8.83656 0-16-7.1634-16-16zm16 15C7.71573 31 1 24.2843 1 16 1 7.71573 7.71573 1 16 1c8.2843 0 15 6.71573 15 15 0 8.2843-6.7157 15-15 15z" clip-rule="evenodd" opacity=".2"/><path d="M16.5303 13.0303c.2929-.2929.2929-.7677 0-1.0606-.2928-.2929-.7677-.2929-1.0606 0l-3.5 3.5c-.2929.2929-.2929.7677 0 1.0606l3.5 3.5c.2929.2929.7678.2929 1.0606 0 .2929-.2929.2929-.7677 0-1.0606L14.3107 16.75H19.5c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75h-5.1893l2.2196-2.2197z"/></svg>',
		        plugins: [
                    new rangePlugin({
                        input: '#check-out'
                    })
                ],
               "locale": "en"
            });
	    }
    
	    if (isMobile) {
            $('.js-datepicker').flatpickr({
                dateFormat: 'd M y',
				"locale": "en"
            });
	    }
	});
	
	// Mobile 
	$('.js-datepicker-mobile').each(function() {
        if (!isMobile) {
            $('.js-datepicker-mobile').flatpickr({
                dateFormat: 'd M y',
		        //minDate: 'today',
		        closeOnSelect: true,
		        allowInput: true,
		        position: 'auto',
		        monthSelectorType: 'static',
                yearSelectorType: 'static',
		        nextArrow: '<svg viewBox="0 0 32 32"><path fill-rule="evenodd" d="M32 16c0-8.83656-7.1634-16-16-16C7.16344 0 0 7.16344 0 16c0 8.8366 7.16344 16 16 16 8.8366 0 16-7.1634 16-16zM16 31c8.2843 0 15-6.7157 15-15 0-8.28427-6.7157-15-15-15C7.71573 1 1 7.71573 1 16c0 8.2843 6.71573 15 15 15z" clip-rule="evenodd" opacity=".2"/><path d="M15.4697 13.0303c-.2929-.2929-.2929-.7677 0-1.0606.2929-.2929.7677-.2929 1.0606 0l3.5 3.5c.2929.2929.2929.7677 0 1.0606l-3.5 3.5c-.2929.2929-.7677.2929-1.0606 0-.2929-.2929-.2929-.7677 0-1.0606l2.2196-2.2197H12.5c-.4142 0-.75-.3358-.75-.75s.3358-.75.75-.75h5.1893l-2.2196-2.2197z"/></svg>',
                prevArrow: '<svg viewBox="0 0 32 32"><path fill-rule="evenodd" d="M0 16C0 7.16344 7.16344 0 16 0c8.8366 0 16 7.16344 16 16 0 8.8366-7.1634 16-16 16-8.83656 0-16-7.1634-16-16zm16 15C7.71573 31 1 24.2843 1 16 1 7.71573 7.71573 1 16 1c8.2843 0 15 6.71573 15 15 0 8.2843-6.7157 15-15 15z" clip-rule="evenodd" opacity=".2"/><path d="M16.5303 13.0303c.2929-.2929.2929-.7677 0-1.0606-.2928-.2929-.7677-.2929-1.0606 0l-3.5 3.5c-.2929.2929-.2929.7677 0 1.0606l3.5 3.5c.2929.2929.7678.2929 1.0606 0 .2929-.2929.2929-.7677 0-1.0606L14.3107 16.75H19.5c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75h-5.1893l2.2196-2.2197z"/></svg>',
		        plugins: [
                    new rangePlugin({
                        input: '#check-out-mobile'
                    })
                ],
               "locale": "en"
            });
	    }
    
	    if (isMobile) {
            $('.js-datepicker').flatpickr({
                dateFormat: 'd M y',
				"locale": "en"
            });
	    }
	});
	
	
    /*-----------------------------------------------------------------
      12. Bootstrap dropdown
    -------------------------------------------------------------------*/

	$('.dropdown-menu').on('click', function(e) {
        e.stopPropagation();
    });


    /*-----------------------------------------------------------------
      13. Progress bar
    -------------------------------------------------------------------*/
    
	function progressBar() {
	    $('.progressBar').each(function() {
		    var ctrl = new ScrollMagic.Controller();
		    new ScrollMagic.Scene({
                triggerElement: '.progressBar',
	            triggerHook: 'onEnter',
	            duration: 300
            })
            .addTo(ctrl)
		    .on("enter", function (e) {
			    var progressBar = $('.progressBar__current');
                progressBar.each(function(indx){
                    $(this).css({'width': $(this).attr('aria-valuenow') + '%', 'z-index': '2'});
                });
		    });
        });
    }
	
	
    /*-----------------------------------------------------------------
      14. Scroll indicator
    -------------------------------------------------------------------*/
    
	function scrollIndicator() {
        $(window).on('scroll', function() {
            var wintop = $(window).scrollTop(), docheight = 
            $(document).height(), winheight = $(window).height();
 	        var scrolled = (wintop/(docheight-winheight))*100;
  	        $('.scroll-line').css('width', (scrolled + '%'));
        });
    };

	scrollIndicator(); //Init
	

    /*-----------------------------------------------------------------
      15. Slider
    -------------------------------------------------------------------*/
 
    // Carousel Testimonials
	$('.js-testimonials').each(function() {
        var swiperTestimonials = new Swiper('.js-testimonials', {
            slidesPerView: 3,
		    spaceBetween: 30,
			grabCursor: true,
		    pagination: {
                el: '.swiper-pagination',
			    clickable: true
            },
		    breakpoints: {
			    0: {
				    slidesPerView: 1,
				    spaceBetween: 15,
			    },
			    768: {
				    slidesPerView: 2,
					spaceBetween: 30
			    },
			    1200: {
				    slidesPerView: 3,
					spaceBetween: 30
			    }			
            }
		});
    });	
	
    // Carousel Rooms
	$('.js-rooms').each(function() {
        var swiperRooms = new Swiper('.js-rooms', {
            slidesPerView: 3,
		    spaceBetween: 30,
			grabCursor: true,
		    pagination: {
                el: '.swiper-pagination',
			    clickable: true
            },
		    breakpoints: {
			    0: {
				    slidesPerView: 1,
				    spaceBetween: 15,
			    },
			    768: {
				    slidesPerView: 2,
					spaceBetween: 30
			    },
			    1200: {
				    slidesPerView: 3,
					spaceBetween: 30
			    }			
            }
		});
    });	
	
    // Slider room details			
	$('.slider-room').each(function() {
	    var interleaveOffset = 1;
		
        var sliderImage = new Swiper('.slider-room', {
            slidesPerView: 1,
		    //parallax: true,
		    speed: 600,
            simulateTouch: false,
		    watchSlidesProgress: true,
			preventInteractionOnTransition: true,
            /*autoplay: {
                disableOnInteraction: false,
			    delay: 4000
            },*/
		    navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
		    on: {
                progress: function() {
				    var swiper = this;
                    for (var i = 0; i < swiper.slides.length; i++) {
                        var slideProgress = swiper.slides[i].progress,
                            innerOffset = swiper.width * interleaveOffset,
                            innerTranslate = slideProgress * innerOffset;					
                        //swiper.slides[i].querySelector('.coverSlider').style.transform = 'translateX(' + innerTranslate + 'px)';	
                        
                        if ($('.slider-room').hasClass('ltr')) {
                            anime.set(swiper.slides[i].querySelector('.coverSlider'), {
                                translateX: function() { return innerTranslate + 'px' },
                                transition: function() { return swiper.params.speed + 'ms' },
                                scale: function() { return 1 }
                            });
                        }
                        if ($('.slider-room').hasClass('rtl')) {
                            anime.set(swiper.slides[i].querySelector('.coverSlider'), {
                                translateX: function() { return -innerTranslate + 'px' },
                                transition: function() { return swiper.params.speed + 'ms' },
                                scale: function() { return 1.05 }
                            });
                        }
                    }
                },
                touchStart: function() {
                    var swiper = this;
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.slides[i].style.transition = "";
                    }
                },
                setTransition: function(speed) {
					var swiper = this;
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.slides[i].style.transition = speed + "ms";
                        swiper.slides[i].querySelector(".coverSlider").style.transition = speed + "ms";
                    }
                    
                },
            }
        });
    });			
	
    // Slider about page
    var swiper = new Swiper('.slider-about', {
		loop: true,
        slidesPerView: 'auto',
        spaceBetween: 140,
        centeredSlides: true,
		grabCursor: true,
		//speed: 900,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
		breakpoints: {
		    0: {
                spaceBetween: 0
            },
			580: {
				spaceBetween: 40
			},
			768: {
				spaceBetween: 40
			},
			990: {
				spaceBetween: 80
			},
			1200: {
				spaceBetween: 80
			},
			1500: {
				spaceBetween: 100
			}			
        }
    });	
	
	// Intro slider 
    function sliders() {
        $('.intro-slider').each(function() {
            var interleaveOffset = 0.9;

            var sliderCaption = new Swiper('.intro-slider__caption', {
                slidesPerView: 1,
				//loop: true,
				//parallax: true,
                effect: 'fade',
				fadeEffect: {
                    crossFade: true
                },
                speed: 1500,
                simulateTouch: false
            });
			
            var sliderImage = new Swiper('.intro-slider__image', {
                slidesPerView: 1,
                //loop: true,
				//parallax: true,
			    speed: 1000,
                simulateTouch: false,
	            roundLengths: true,
				watchSlidesProgress: true,
                autoplay: {
                    disableOnInteraction: false,
					delay: 4000
                },
                keyboard: {
	                enabled: true
	            },
                navigation: {
                    nextEl: '.slider-next',
                    prevEl: '.slider-prev'
                },
				on: {
                    progress: function() {
						if (!isIE) {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                var slideProgress = swiper.slides[i].progress,
                                    innerOffset = swiper.width * interleaveOffset,
                                    innerTranslate = slideProgress * innerOffset;	
								if ($('.intro-slider').hasClass('ltr')) {
                                    swiper.slides[i].querySelector('.coverSlider').style.transform = 'translateX(' + innerTranslate + 'px)';
                                }
                                if ($('.intro-slider').hasClass('rtl')) {
                                    swiper.slides[i].querySelector('.coverSlider').style.transform = 'translateX(' + -innerTranslate + 'px)';
                                }
                            }
						}
                    },
                    touchStart: function() {
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {
                            swiper.slides[i].style.transition = "";
                        }
                    },
                    setTransition: function(speed) {
						if (!isIE) {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                swiper.slides[i].style.transition = speed + "ms";
                                swiper.slides[i].querySelector(".coverSlider").style.transition = speed + "ms";
                            }
						}
                    }
                }
            });
					
            sliderCaption.controller.control = sliderImage;
            sliderImage.controller.control = sliderCaption;
		});
    };


    /*-----------------------------------------------------------------
      16. Style background image
    -------------------------------------------------------------------*/	
  
    $('.js-image').each(function(){
        var dataImage = $(this).attr('data-image');
        $(this).css('background-image', 'url(' + dataImage + ')');
    });


    /*-----------------------------------------------------------------
      17. Cover youtube
    -------------------------------------------------------------------*/

    var video_wrapper = $('.youtube-video-place');
	
    if(video_wrapper.length){
        $('.video__btn').on('click', function(){
            video_wrapper.html('<iframe allowfullscreen frameborder="0" class="js-video-iframe" src="' + video_wrapper.data('yt-url') + '"></iframe>');
        });
    }
	
	
    /*-----------------------------------------------------------------
      18. Popup video
    -------------------------------------------------------------------*/	

    var videopopup_wrapper = $('.youtube-popup');
	
    if(videopopup_wrapper.length){
        $('.intro__btn-play').on('click', function(e){
			e.preventDefault();
            openbox();
            videopopup_wrapper.html('<iframe allowfullscreen frameborder="0" class="js-video-iframe" src="' + videopopup_wrapper.data('yt-url') + '"></iframe>');
        });
    }

    $('.close-popup').on('click', function(){
        closebox();
    });
	
	$(document).on('keyup', function(e) {
        if (e.keyCode === 27) closebox();
    });
	
    function openbox(){
        $('.lightbox-backdrop').css({'display':'block','pointer-events':'all'});
        $('.lightbox-backdrop, .lightbox-content').delay(350).animate({'opacity':'1'}, 300, 'linear');
	    $('.btn-play__popup').addClass('is-active');
	    $('.intro').css({zIndex: '4'});
    }

    function closebox() {
        $('.lightbox-backdrop, .lightbox-content').animate({'opacity':'0'}, 300, 'linear', function(){
            $('.lightbox-backdrop').css({'display':'none'});
		    $('.btn-play__popup').removeClass('is-active');
		    $('iframe').remove();
		    $('.intro').css({zIndex: '0'});
        });
    }
	
	
    /*-----------------------------------------------------------------
      19. Autoresize textarea
    -------------------------------------------------------------------*/	

    $('textarea').each(function(){
        autosize(this);
    });
	
	
    /*-----------------------------------------------------------------
      20. Switch categories & Filter mobile
    -------------------------------------------------------------------*/	
  
    $('.select').on('click','.placeholder',function(){
      var parent = $(this).closest('.select');
      if ( ! parent.hasClass('is-open')){
          parent.addClass('is-open');
          $('.select.is-open').not(parent).removeClass('is-open');
      }else{
          parent.removeClass('is-open');
      }
    }).on('click','ul>li',function(){
        var parent = $(this).closest('.select');
        parent.removeClass('is-open').find('.placeholder').text( $(this).text() );
        parent.find('input[type=hidden]').attr('value', $(this).attr('data-value') );
	
	    $('.filter__item').removeClass('active');
	    $(this).addClass('active');
	    var selector = $(this).attr('data-filter');
	    $('.js-sort').isotope({
	        filter: selector
	    });
	    return false;	
    });

  
    /*-----------------------------------------------------------------
      21. Masonry
    -------------------------------------------------------------------*/
  
    // News
    var $newsGrid=$('.js-news').isotope({
        itemSelector: '.itemNews',
	    layoutMode: 'fitRows',
        percentPosition: true,
	    transitionDuration: '0.5s',
        hiddenStyle: {
            opacity: 0,
            transform: 'scale(0.001)'
        },
        visibleStyle: {
            opacity: 1,
            transform: 'scale(1)'
        },
        fitRows: {
            gutter: '.gutter-sizer'
        },	
        masonry: {
	        columnWidth: '.itemNews',
            gutter: '.gutter-sizer',
            isAnimated: true
        }
    });
  
    $newsGrid.imagesLoaded().progress( function() {
        $newsGrid.isotope ({
	        columnWidth: '.itemNews',
            gutter: '.gutter-sizer',
            isAnimated: true,
	        layoutMode: 'fitRows',
            fitRows: {
                gutter: '.gutter-sizer'
            }  	  
	    });
    });

    // Gallery
    var $masonryGallery=$('.js-gallery').isotope({
        itemSelector: '.itemGallery',
        percentPosition: true,
	    transitionDuration: '0.5s',
        hiddenStyle: {
            opacity: 0,
            transform: 'scale(0.001)'
        },
        visibleStyle: {
            opacity: 1,
            transform: 'scale(1)'
        },	
        masonry: {
	        columnWidth: '.itemGallery',
            isAnimated: true
        }
    });
  
    $masonryGallery.imagesLoaded().progress( function() {
        $masonryGallery.isotope ({
	        columnWidth: '.itemGallery',
            isAnimated: true
	    });
    });
	
	
    /*-----------------------------------------------------------------
      22. Sticky sidebar
    -------------------------------------------------------------------*/

    function activeStickyKit() {
        $('.sticky-column').stick_in_parent({
            parent: '.sticky-parent'
        });

        // bootstrap col position
        $('.sticky-column')
        .on('sticky_kit:bottom', function(e) {
            $(this).parent().css('position', 'static');
        })
        .on('sticky_kit:unbottom', function(e) {
            $(this).parent().css('position', 'relative');
        });
    };
    activeStickyKit();

    function detachStickyKit() {
        $('.sticky-column').trigger("sticky_kit:detach");
    };

    //  stop sticky kit
    //  based on your window width

    var screen = 1200;

    var windowHeight, windowWidth;
    windowWidth = $(window).width();
    if ((windowWidth < screen)) {
        detachStickyKit();
    } else {
        activeStickyKit();
    }

    // windowSize
    // window resize
    function windowSize() {
        windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
        windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
    }
    windowSize();

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    $(window).resize(debounce(function(){
        windowSize();
        $(document.body).trigger("sticky_kit:recalc");
        if (windowWidth < screen) {
            detachStickyKit();
        } else {
            activeStickyKit();
        }
    }, 250));

	
    /*-----------------------------------------------------------------
      23. Animations
    -------------------------------------------------------------------*/

    function tween() {
	    // init ScrollMagic
        var ctrl = new ScrollMagic.Controller(); 
        var $split = $('.js-lines'); 
	
        // Text wave for slider
        function textWave(){
            if($(".js-text-wave").length){
                $(".js-text-wave").each(function(){
                    if(!$(this).hasClass("complete")){
                        $(this).addClass("complete");
		                var textChange = $(this).html().replace("<br />", "~"),
		                    textChange = textChange.replace("<br>", "~"),
                            textChange = $(this).html(),
                            textArray = textChange.split(""), //  /\r?\n/
                            textDone = "",
                            num;
                        for (var i = 0; i < textArray.length; i++) {
                            if(textArray[i] == " "){
                                textDone += " ";
                            } else if(textArray[i] == "~"){
                                textDone += "<br />";
                            } else{
                                textDone += '<div><span style="transition-delay: '+(i/30)+'s;">'+textArray[i]+'</span></div>';
                            }
                        }
                        $(this).html(textDone);
                    }
                });
            }
        }	
        textWave();	

        // Scale
        $('.js-scale').each(function() {
            var animScale = anime({
                targets: '.js-scale',
                scale: ['1.2', '1'],
                opacity: [0, 1],
                duration: 1000,
                delay: 300,
                easing: 'easeOutCirc'
            });
        });
		
        // Scale down image
        $('.js-scale-down').each(function() {
            var animScaleDown = anime.timeline({});
            anime.set('.js-scale-down div', {
                scale: 1.1
            });
            animScaleDown
            .add({
                targets: '.js-scale-down div',
                duration: 1000,
                scale: 1,
                easing: 'easeOutCirc'
            });
        });

        // Split chars
        Splitting({
            target: '.js-words',
            by: 'chars',
            force: true
        });

        // Words
        $('.js-words .char').each(function(index) {
            var animWords = anime({
                targets: this,
                translateY: ['100%', '0%'],
                duration: 400,
                easing: 'easeOutCirc',
                delay: 30 + index * 30,
                autoplay: false
            });
            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onEnter',
                reverse: false
            })
            .setAnime(animWords)
            .addTo(ctrl);
        });
        
        // Split lines
        var res = Splitting({
            target: '.js-lines',
            by: 'lines',
            force: true
        });
    
        res.forEach(function (splitResult) {
            var wrappedLines = splitResult.lines.map(function (wordsArr) {
                return '\n<span class="line">\n' + wordsArr.map(function (word) {
                    return word.outerHTML + '<span class="whitespace"> \n</span>';
                }).join('') + '\n</span>';
            }).join('');
            splitResult.el.innerHTML = wrappedLines;
        });

        // Lines
        $('.js-lines .line').each(function(index) {
            var animLines = anime({
                targets: this,
                translateY: ['100%', '0%'],
                opacity: [0, 1],
                duration: 600,
                easing: 'easeOutCirc',
                delay: 60 + index * 60,
                autoplay: false
            });
            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onEnter',
                reverse: false
            })
            .setAnime(animLines)
            .addTo(ctrl);
        });

        // Show scroll
        $('.js-scroll-show').each(function() {
            var animSlideDown = anime({
                targets: this,
                translateY: [60, 0],
                opacity: [0, 1],
                duration: 1000,
                delay: 300,
                easing: 'easeOutCirc',
                autoplay: false
            });
            new ScrollMagic.Scene({
                triggerElement: this,
                triggerHook: 'onEnter',
                reverse: false
            })
            .setAnime(animSlideDown)
            .addTo(ctrl);
        });

        // Hide scroll
        $('.js-scroll-hide').each(function() {
            var animHide = anime({
                targets: this,
                translateY: [0, 60],
                opacity: [1, 0],
                duration: 400,
                delay: 300,
                easing: 'easeOutCirc',
                autoplay: false
            });
            new ScrollMagic.Scene({
                triggerElement: this,
                triggerHook: 'onLeave',
                duration: 300,
                reverse: false
            })
            .setAnime(animHide)
            .addTo(ctrl);
        });
		
        // Opacity scroll
        $('.js-scroll-opacity').each(function() {
            if (!isMobile) {
                var animOpacity = anime({
                    targets: this,
                    marginTop: [60, 0],
                    opacity: [0, 1],
                    duration: 1000,
                    easing: 'easeOutCirc',
                    autoplay: false
                });
            } else {
                var animOpacity = anime({
                    targets: this,
                    opacity: [0, 1],
                    duration: 1000,
                    easing: 'easeOutCirc',
                    autoplay: false
                });
            }

            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onEnter',
	            reverse: false
            })
            .setAnime(animOpacity)
            .addTo(ctrl);
        });
    }; 


    /*-----------------------------------------------------------------
      24. Jarallax
    -------------------------------------------------------------------*/		

    function parallax() {
        $('.js-parallax').jarallax({
			disableParallax: function () {
			  return isIE
			},
            speed: 0.65,
            type: 'scroll'
        });

        $('.js-parallax-video').jarallax({
            disableParallax: function () {
			  return isIE
			}
        });
		
        $('.js-parallax-img').jarallax({
			speed: 0.8,
			disableParallax: function () {
			  return isIE
			}
        });
	};
	
	parallax(); //Init


    /*-----------------------------------------------------------------
	  25. Anchor scroll
    -------------------------------------------------------------------*/	
	
    $('a[href^="!#"]').on('click',function (e) {
        e.preventDefault();
        var target = this.hash;
	    var $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
        }, 900, 'swing', function () {
            window.location.hash = target;
        });
    });


    /*-----------------------------------------------------------------
      26. ShowToScroll
    -------------------------------------------------------------------*/
	
    function ShowToScroll() {
        var $targetElement = $('.js-show-to-scroll'),
            $showBackTotop = 100; //$(window).height()
			
        //$targetElement.hide();
		$targetElement.addClass('animated bounceOut');
        
        $(window).on('scroll', function() {
            var windowScrollTop = $(window).scrollTop();
            if( windowScrollTop > $showBackTotop ) {
				//$targetElement.fadeIn('800, swing');
				$targetElement.addClass('bounceIn');
				$targetElement.removeClass('bounceOut');
            } else {
				//$targetElement.fadeOut('500, swing');
				$targetElement.removeClass('bounceIn');
				$targetElement.addClass('bounceOut');
            }
			
			$targetElement.removeClass('is-bottom');
			if($(window).scrollTop() + $(window).height() > ($(document).height() - 100) ) {
                $targetElement.addClass('is-bottom');
            }
        });
    }
	
	ShowToScroll(); //Init


    /*-----------------------------------------------------------------
      27. Polyfill object-fit
    -------------------------------------------------------------------*/	
	
    var $someImages = $('img.cover');
    objectFitImages($someImages);


    /*-----------------------------------------------------------------
      28. Animated counter
    -------------------------------------------------------------------*/	
	
	function counter() {
	  $('.item-count span').countimator();
	};
	
	
    /*-----------------------------------------------------------------
      29. Parallax mouse
    -------------------------------------------------------------------*/

	var timeout;
    $('.container-center').mousemove(function(e){
        if(timeout) clearTimeout(timeout);
            setTimeout(callParallax.bind(null, e), 200);
  
    });

    function callParallax(e){
        parallaxIt(e, '.js-parallax-mouse', -30);
    }

    function parallaxIt(e, target, movement){
		if (!isMobile) {
            var $this = $('.container-center'),
                relX = e.pageX - $this.offset().left,
                relY = e.pageY - $this.offset().top;
  
                var animMove = anime({
                    targets: target,
                    translateX: (relX - $this.width()/2) / $this.width() * movement,
                    translateY: (relY - $this.height()/2) / $this.height() * movement,
                    duration: 1000,
                    easing: 'easeOutCirc'
                });
		}
    }


	/*-----------------------------------------------------------------
	  30. PhotoSwipe
	-------------------------------------------------------------------*/

    var initPhotoSwipeFromDOM = function(gallerySelector) {
        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item;

            for(var i = 0; i < numNodes; i++) {
                figureEl = thumbElements[i]; // <figure> element
					
                if(figureEl.nodeType !== 1) {
                    continue;
                }

                linkEl = figureEl.children[0]; // <a> element
                size = linkEl.getAttribute('data-size').split('x');

                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                if(figureEl.children.length > 1) {
                    item.title = figureEl.children[1].innerHTML; 
                }

                if(linkEl.children.length > 0) {
                    item.msrc = linkEl.children[0].getAttribute('src');
                } 

                item.el = figureEl;
                items.push(item);
            }
            return items;
        };

        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };

        var onThumbnailsClick = function(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            var clickedListItem = closest(eTarget, function(el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });

            if(!clickedListItem) {
                return;
            }

            var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) { 
                    continue; 
                }

                if(childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }
					
            if(index >= 0) {
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };

        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
                params = {};

            if(hash.length < 5) {
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');  
                if(pair.length < 2) {
                    continue;
                }           
                params[pair[0]] = pair[1];
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);

            options = {
                // Buttons/elements
                captionEl: false,
                closeEl: true,
                arrowEl: true,
                fullscreenEl: false,
                shareEl: false,
                counterEl: false,
                zoomEl: true,
				preloaderEl: true,
                //maxSpreadZoom: 1,
			    barsSize: { top: 40, bottom: 40, left: 40, right: 40 },
                // define gallery index (for URL)
			    galleryUID: 0
            };

            // PhotoSwipe opened from URL
            if(fromURL) {
                if(options.galleryPIDs) {
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            if( isNaN(options.index) ) {
                return;
            }

            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }

            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        var galleryElements = document.querySelectorAll( gallerySelector );
            for(var i = 0, l = galleryElements.length; i < l; i++) {
                galleryElements[i].setAttribute('data-pswp-uid', i+1);
                galleryElements[i].onclick = onThumbnailsClick;
            }

        var hashData = photoswipeParseHash();
        if(hashData.pid && hashData.gid) {
            openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
        }
    };

    // execute above function
    initPhotoSwipeFromDOM('.js-lightbox');

	
    /*-----------------------------------------------------------------
      31. Credit Card Validator
    -------------------------------------------------------------------*/
	
	$('#payment-form').each(function() {
	    $('#payment-form').card({
            container: '.card-wrapper',
            formSelectors: {
                numberInput: 'input#numberCard',
                expiryInput: 'input#expiryCard',
                cvcInput: 'input#cvc',
                nameInput: 'input#nameCard'
            },
            formatting: true,
            messages: {
                monthYear: 'Expiry',
            },
            placeholders: {
                number: '•••• •••• •••• ••••',
                name: 'Full Name',
                expiry: '••/••',
                cvc: '•••'
            }
        });
		
		$('#numberCard').on('keypress keydown', function(e) {
            var that = $(this),
			    cardNum = $('.jp-card-number'),
                textLength = that.val().length;
    
            if(textLength > 19) {
				cardNum.addClass('font-size-1');
				cardNum.removeClass('font-size-2');
            } else if(textLength > 0) {
				cardNum.addClass('font-size-2');
				cardNum.removeClass('font-size-1');
            }
        });
		
		$('#nameCard').on('keyup', function(e){
            $(this).val($(this).val().toUpperCase());
            var regexp = /[^a-zA-Z áéíóúÁÉÍÓÚüÜ]/g;
            if($(this).val().match(regexp)){
                $(this).val( $(this).val().replace(regexp,'') );
            }
        });
    });
	
	
	/*-----------------------------------------------------------------
      32. Working booking form
    -------------------------------------------------------------------*/

    $("#booking-form").validator({focus: false}).on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            formError();
            submitMSG(false, "Please fill in the form...");
        } else {
            event.preventDefault();
            submitForm();
        }
    });

    function submitForm(){
        // Initiate Variables With Form Content
        var name = $("#name").val(),
            email = $("#email").val(),
			phone = $("#phone").val(),
			checkIn = $("#check-in").val(),
			checkOut = $("#check-out").val(),
			adult = $("#person-adult").val(),
			kids = $("#person-kids").val();

        $.ajax({
            type: "POST",
            url: "assets/php/booking-form.php",
            data: "name=" + name + "&email=" + email + "&phone=" + phone + "&checkIn=" + checkIn + "&checkOut=" + checkOut + "&adult=" + adult + "&kids=" + kids,
            success : function(text){
                if (text == "success"){
                    formSuccess();
                } else {
                    formError();
                    submitMSG(false,text);
                }
            }
        });
    }

    function formSuccess(){
        $("#booking-form")[0].reset();
        submitMSG(true, "Thanks! We have received your reservation.");
    }

    function formError(){
        
    }
  
    function submitMSG(valid, msg){
        if(valid){
            var msgClasses = "validation-success";
        } else {
           var msgClasses = "validation-danger";
        }
        $("#validator-contact").removeClass().addClass(msgClasses).text(msg);
    }
});