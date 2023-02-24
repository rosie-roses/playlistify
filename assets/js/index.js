$(".next-section").click(function () {
  $("html, body").animate(
    {
      scrollTop: $("section").next().offset().top,
    },
    1000
  );
});

// const form = document.querySelector('form');

// form.addEventListener('submit', async (ev) => {
//   ev.preventDefault();
//   const track = document.querySelector('.trk-post').textContent;
//   const artist = document.querySelector('.artist-post').textContent;
//   try {
//     const res = await fetch('/', {
//       method: 'POST',
//       body: JSON.stringify({ track, artist }),
//       headers: { 'Content-Type': 'application/json' }
//     });
//     const data = await res.json();
//     if (data.error)
//   } catch (err) {
//     console.log(err);
//   }
// });