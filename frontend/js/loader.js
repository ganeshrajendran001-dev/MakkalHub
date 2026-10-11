
document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("makkalhub-loader");
    const bar = document.getElementById("loader-progress-bar");
    const percentage = document.getElementById("loader-percentage");

    if (!loader || !bar || !percentage) return;

    let progress = 0;
    const duration = 5000;
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(function () {
        progress = Math.min(progress + increment, 100);

        bar.style.width = progress + "%";
        percentage.textContent = Math.floor(progress);

        if (progress >= 100) {
            clearInterval(timer);

            setTimeout(function () {
                loader.classList.add("loader-hidden");
            }, 100);
        }
    }, intervalTime);
});