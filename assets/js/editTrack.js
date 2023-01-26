const form = document.querySelector('form');
const errorOutput = document.querySelector('.error_output');

form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    // Reset errors.
    errorOutput.textContent = '';

    // Get the values.
    const track_name = form.track_name.value;
    const track_artist = form.track_artist.value;
    const track_rating = form.elements['stars'].value;
    try {
        const res = await fetch('/edit-track', {
            method: 'POST',
            body: JSON.stringify({ track: track_name, artist: track_artist, rating: track_rating }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.error) {
            errorOutput.textContent = data.error;
        }
        if (data.trackObj) {
            location.assign('/profile');
        }
    } catch (err) {
        console.log(err);
    }
});