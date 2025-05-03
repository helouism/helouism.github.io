$(document).ready(function () {
  // Navbar color change on scroll
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });

  // Smooth scrolling for anchor links
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    var target = $(this.hash);
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 70,
        },
        100,
      );
    }
  });

  // Initialize particles.js
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: false,
      },
      size: {
        value: 3,
        random: true,
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
    },
    retina_detect: true,
  });

  // Skill cards animation on scroll
  $(window).scroll(function () {
    $(".skill-card").each(function () {
      if (isElementInView($(this))) {
        $(this).addClass("animate__animated animate__fadeInUp");
      }
    });
  });

  // Project cards hover effect
  $(".project-card").hover(
    function () {
      $(this).find(".card-img-top").css("transform", "scale(1.05)");
    },
    function () {
      $(this).find(".card-img-top").css("transform", "scale(1)");
    },
  );

  // Progress bars animation
  $(".progress-bar").each(function () {
    $(this).animate(
      {
        width: $(this).attr("style").split(":")[1],
      },
      1500,
    );
  });

  // Helper function to check if element is in viewport
  function isElementInView(element) {
    var elementTop = element.offset().top;
    var elementBottom = elementTop + element.outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

  // Typing animation for hero section
  function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
      $(".animated-text").text(text.substring(0, i + 1));
      setTimeout(function () {
        typeWriter(text, i + 1, fnCallback);
      }, 100);
    } else if (typeof fnCallback == "function") {
      setTimeout(fnCallback, 700);
    }
  }

  // Start the typing animation
  var text = "IT Fresh Graduate & Web Developer";
  typeWriter(text, 0, function () {
    // Typing complete callback
  });
});

// Add loading animation
$(window).on("load", function () {
  $(".preloader").fadeOut("slow");
});
