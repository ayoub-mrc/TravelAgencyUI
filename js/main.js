document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;

      setTimeout(() => {
        if (typeof $ !== "undefined" && $.fn.slicknav) {
          var menu = $("ul#navigation");
          if (menu.length) {
            menu.slicknav({
              prependTo: ".mobile_menu",
              closedSymbol: "+",
              openedSymbol: "-",
            });
            console.log("✅ SlickNav initialized");
          } else {
            console.warn("⚠️  ul#navigation not defined");
          }
        } else {
          console.error("⚠️ jQuery and slicknav not loaded yet ");
        }
      }, 300); // ننتظر 300ms
    });

  fetch("footer.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    });
});

function initializeSwiper() {
  const swiperElement = document.querySelector(".swiper");
  if (swiperElement) {
    const swiper = new Swiper(".swiper", {
      direction: "horizontal",
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }, // 1. تعيين الإعداد الافتراضي (لأصغر الشاشات)

      slidesPerView: 1,
      spaceBetween: 20,

      // 2. تطبيق نقاط التوقف لتغيير العرض في الشاشات الأكبر
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 20 },
        992: { slidesPerView: 2, spaceBetween: 20 },
        1200: { slidesPerView: 3, spaceBetween: 30 },
      },

      // 3. الحل لمشكلة النقر (ضروري لروابط الهاتف)
      slideToClickedSlide: true,
    });
    console.log("✅ Swiper Initialized with breakpoints.");
  } else {
    console.warn("⚠️ Swiper element not found.");
  }
}

initializeSwiper();
//Add Update info with from

const form = document.getElementById("dataForm");
const resultsDiv = document.getElementById("results");
// NOTE: إذا كنت تختبر محليًا، قد تحتاج لتعديل المسار ليتضمن النطاق:
// const apiEndpoint = 'https://localhost:7000/api/Customers';
const apiEndpoint = "api/Customers"; // المسار إلى نقطة النهاية POST

// 2. دالة مساعدة لتحديث حالة التحقق في Bootstrap
const updateValidation = (inputElement, condition) => {
  if (condition) {
    inputElement.classList.add("is-valid");
    inputElement.classList.remove("is-invalid");
    return true;
  } else {
    inputElement.classList.add("is-invalid");
    inputElement.classList.remove("is-valid");
    return false;
  }
};

// 3. دالة إرسال البيانات إلى C# Backend
const sendDataToApi = async (data) => {
  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer YOUR_JWT_TOKEN', // للتحقق من الهوية
      },
      body: JSON.stringify(data),
    });

    // التحقق من حالة الاستجابة
    // الكنترولر يعيد 201 Created، وهذا ممتاز للنجاح
    if (response.status === 201) {
      const createdCustomer = await response.json();

      resultsDiv.classList.remove("alert-danger");
      resultsDiv.classList.add("alert-success");
      resultsDiv.innerHTML = `✅ تم تسجيل العميل بنجاح! رقم العميل: ${createdCustomer.id}`;
      return true;
    } else {
      // محاولة قراءة رسالة خطأ من الـ Controller
      let errorMessage = `فشل الإرسال: الحالة ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
        // أو إذا كان الـ Controller يرجع الأخطاء بصيغة ValidationProblemDetails (400)
        else if (errorData.errors) errorMessage = "خطأ في البيانات المُرسلة.";
      } catch (e) {
        // إذا لم تكن الاستجابة JSON
        errorMessage = `فشل الإرسال: الحالة ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("API Error:", error);
    resultsDiv.classList.remove("alert-success");
    resultsDiv.classList.add("alert-danger");
    resultsDiv.innerHTML = `❌ حدث خطأ: ${error.message}`;
    return false;
  }
};

// 4. معالج حدث الإرسال الرئيسي

/* form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        event.stopPropagation(); 

        resultsDiv.classList.add('d-none');
        
        // أ. جمع البيانات والتحقق منها
        const formData = new FormData(form);
        const name = formData.get('fullName').trim();
        const email = formData.get('email').trim();
        const phone = formData.get('phone').trim();
        const city = formData.get('city').trim();
        
        let isValid = true;
        
        // التحقق من صحة الحقول (Client-Side Validation)
        if (!updateValidation(document.getElementById('fullName'), name !== '')) isValid = false;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!updateValidation(document.getElementById('userEmail'), emailPattern.test(email))) isValid = false;
        const phonePattern = /^\d{10,}$/; 
        if (!updateValidation(document.getElementById('userPhone'), phonePattern.test(phone))) isValid = false;
        if (!updateValidation(document.getElementById('userCity'), city !== '')) isValid = false;

        
        // ب. إذا كانت البيانات صالحة
        if (isValid) {
            
            // تهيئة البيانات لإرسالها
            const submissionData = {
                // Key names MUST match C# Customer Model properties
                FullName: name,
                Email: email,
                Phone: phone, 
                City: city
            };

            // إرسال البيانات
            const success = await sendDataToApi(submissionData);
            
            // تصفير النموذج فقط عند النجاح
            if (success) {
                form.reset();
                document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
            }
            resultsDiv.classList.remove('d-none'); // إظهار رسالة النجاح/الخطأ
        }
    });*/


    
(function ($) {
  "use strict";
  // TOP Menu Sticky
  $(window).on("scroll", function () {
    var scroll = $(window).scrollTop();
    if (scroll < 400) {
      $("#sticky-header").removeClass("sticky");
      $("#back-top").fadeIn(500);
    } else {
      $("#sticky-header").addClass("sticky");
      $("#back-top").fadeIn(500);
    }
  });

  $(document).ready(function () {
    // mobile_menu
    var menu = $("ul#navigation");
    if (menu.length) {
      menu.slicknav({
        prependTo: ".mobile_menu",
        closedSymbol: "+",
        openedSymbol: "-",
      });
    }
    // blog-menu
    // $('ul#blog-menu').slicknav({
    //   prependTo: ".blog_menu"
    // });

    // review-active
    $(".slider_active").owlCarousel({
      loop: true,
      margin: 0,
      items: 1,
      autoplay: true,
      navText: [
        '<i class="ti-angle-left"></i>',
        '<i class="ti-angle-right"></i>',
      ],
      nav: true,
      dots: false,
      autoplayHoverPause: true,
      autoplaySpeed: 800,
      animateOut: "fadeOut",
      animateIn: "fadeIn",
      responsive: {
        0: {
          items: 1,
          nav: false,
        },
        767: {
          items: 1,
        },
        992: {
          items: 1,
        },
        1200: {
          items: 1,
        },
        1600: {
          items: 1,
        },
      },
    });

    // review-active
    $(".testmonial_active").owlCarousel({
      loop: true,
      margin: 0,
      items: 1,
      autoplay: true,
      navText: [
        '<i class="ti-angle-left"></i>',
        '<i class="ti-angle-right"></i>',
      ],
      nav: false,
      dots: true,
      autoplayHoverPause: true,
      autoplaySpeed: 800,
      responsive: {
        0: {
          items: 1,
        },
        767: {
          items: 1,
        },
        992: {
          items: 1,
        },
        1200: {
          items: 1,
        },
        1500: {
          items: 1,
        },
      },
    });

    $(function () {
      $("#slider-range").slider({
        range: true,
        min: 0,
        max: 600,
        values: [75, 300],
        slide: function (event, ui) {
          $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        },
      });
      $("#amount").val(
        "$" +
          $("#slider-range").slider("values", 0) +
          " - $" +
          $("#slider-range").slider("values", 1)
      );
    });

    // for filter
    // init Isotope
    var $grid = $(".grid").isotope({
      itemSelector: ".grid-item",
      percentPosition: true,
      masonry: {
        // use outer width of grid-sizer for columnWidth
        columnWidth: 1,
      },
    });

    // filter items on button click
    $(".portfolio-menu").on("click", "button", function () {
      var filterValue = $(this).attr("data-filter");
      $grid.isotope({ filter: filterValue });
    });

    //for menu active class
    $(".portfolio-menu button").on("click", function (event) {
      $(this).siblings(".active").removeClass("active");
      $(this).addClass("active");
      event.preventDefault();
    });

    // wow js
    new WOW().init();

    // counter
    $(".counter").counterUp({
      delay: 10,
      time: 10000,
    });

    /* magnificPopup img view */
    $(".popup-image").magnificPopup({
      type: "image",
      gallery: {
        enabled: true,
      },
    });

    /* magnificPopup img view */
    $(".img-pop-up").magnificPopup({
      type: "image",
      gallery: {
        enabled: true,
      },
    });

    /* magnificPopup video view */
    $(".popup-video").magnificPopup({
      type: "iframe",
    });

    // scrollIt for smoth scroll
    $.scrollIt({
      upKey: 38, // key code to navigate to the next section
      downKey: 40, // key code to navigate to the previous section
      easing: "linear", // the easing function for animation
      scrollTime: 600, // how long (in ms) the animation takes
      activeClass: "active", // class given to the active nav element
      onPageChange: null, // function(pageIndex) that is called when page is changed
      topOffset: 0, // offste (in px) for fixed top navigation
    });

    // scrollup bottom to top
    $.scrollUp({
      scrollName: "scrollUp", // Element ID
      topDistance: "4500", // Distance from top before showing element (px)
      topSpeed: 300, // Speed back to top (ms)
      animation: "fade", // Fade, slide, none
      animationInSpeed: 200, // Animation in speed (ms)
      animationOutSpeed: 200, // Animation out speed (ms)
      scrollText: '<i class="fa fa-angle-double-up"></i>', // Text for element
      activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
    });

    // blog-page

    //brand-active
    $(".brand-active").owlCarousel({
      loop: true,
      margin: 30,
      items: 1,
      autoplay: true,
      nav: false,
      dots: false,
      autoplayHoverPause: true,
      autoplaySpeed: 800,
      responsive: {
        0: {
          items: 1,
          nav: false,
        },
        767: {
          items: 4,
        },
        992: {
          items: 7,
        },
      },
    });

    // blog-dtails-page

    //project-active
    $(".project-active").owlCarousel({
      loop: true,
      margin: 30,
      items: 1,
      // autoplay:true,
      navText: [
        '<i class="Flaticon flaticon-left-arrow"></i>',
        '<i class="Flaticon flaticon-right-arrow"></i>',
      ],
      nav: true,
      dots: false,
      // autoplayHoverPause: true,
      // autoplaySpeed: 800,
      responsive: {
        0: {
          items: 1,
          nav: false,
        },
        767: {
          items: 1,
          nav: false,
        },
        992: {
          items: 2,
          nav: false,
        },
        1200: {
          items: 1,
        },
        1501: {
          items: 2,
        },
      },
    });

    if (document.getElementById("default-select")) {
      $("select").niceSelect();
    }

    //about-pro-active
    $(".details_active").owlCarousel({
      loop: true,
      margin: 0,
      items: 1,
      // autoplay:true,
      navText: [
        '<i class="ti-angle-left"></i>',
        '<i class="ti-angle-right"></i>',
      ],
      nav: true,
      dots: false,
      // autoplayHoverPause: true,
      // autoplaySpeed: 800,
      responsive: {
        0: {
          items: 1,
          nav: false,
        },
        767: {
          items: 1,
          nav: false,
        },
        992: {
          items: 1,
          nav: false,
        },
        1200: {
          items: 1,
        },
      },
    });
  });

  // resitration_Form
  $(document).ready(function () {
    $(".popup-with-form").magnificPopup({
      type: "inline",
      preloader: false,
      focus: "#name",

      // When elemened is focused, some mobile browsers in some cases zoom in
      // It looks not nice, so we disable it:
      callbacks: {
        beforeOpen: function () {
          if ($(window).width() < 700) {
            this.st.focus = false;
          } else {
            this.st.focus = "#name";
          }
        },
      },
    });
  });

  //------- Mailchimp js --------//
  function mailChimp() {
    $("#mc_embed_signup").find("form").ajaxChimp();
  }
  mailChimp();

  // Search Toggle
  $("#search_input_box").hide();
  $("#search").on("click", function () {
    $("#search_input_box").slideToggle();
    $("#search_input").focus();
  });
  $("#close_search").on("click", function () {
    $("#search_input_box").slideUp(500);
  });
  // Search Toggle
  $("#search_input_box").hide();
  $("#search_1").on("click", function () {
    $("#search_input_box").slideToggle();
    $("#search_input").focus();
  });
  $(document).ready(function () {
    $("select").niceSelect();
  });

  // prise slider
})(jQuery);
