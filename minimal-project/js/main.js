// الوظائف الأساسية للموقع
(function ($) {
  "use strict";

  // القائمة المتنقلة للشاشات الصغيرة
  $("#mobile_menu").slicknav({
    prependTo: ".mobile_menu",
  });

  // تثبيت القائمة عند التمرير
  $(window).on("scroll", function () {
    var scroll = $(window).scrollTop();
    if (scroll < 300) {
      $(".header-area").removeClass("sticky");
    } else {
      $(".header-area").addClass("sticky");
    }
  });
})(jQuery);
