var debugSubmap2D = false;

// ALT+V
document.onkeydown = function (e) {
    if ((e.altKey && e.keyCode == 'V'.charCodeAt(0))) {
        debugSubmap2D = !debugSubmap2D;
        return false;
    }
}