$(".next-section").click(function () {
  $("html, body").animate(
    {
      scrollTop: $("section").next().offset().top,
    },
    1000
  );
});