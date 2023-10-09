function openCvReady() {
    // adding the compulsary code similar to boiler plate
    cv["onRuntimeInitialized"] = () => {

        const fileInput = document.getElementById('file-input');
        const previewImage = document.getElementById('preview-image');

        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            const reader = new FileReader();

            let imgMain = cv.imread('preview-image');

            // -----------restore to original-----------
            let restore = document.getElementById('btn-restore');
            restore.addEventListener("click", (e) => {
                let imgMain = cv.imread("preview-image");
                cv.imshow("main-canvas", imgMain);
                imgMain.delete();
            });

            // ------- CONTOURS -------
            let cnt = document.getElementById('btn-contour');
            cnt.addEventListener("click", (e) => {
                let imgMain = cv.imread('preview-image');
                let dst = cv.Mat.zeros(imgMain.rows, imgMain.cols, cv.CV_8UC3);
                cv.cvtColor(imgMain, imgMain, cv.COLOR_RGBA2GRAY, 0);
                cv.threshold(imgMain, imgMain, 120, 200, cv.THRESH_BINARY);
                let contours = new cv.MatVector();
                let hierarchy = new cv.Mat();
                // You can try more different parameters
                cv.findContours(imgMain, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
                // draw contours with random Scalar
                for (let i = 0; i < contours.size(); ++i) {
                    let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255));
                    cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
                }
                cv.imshow('main-canvas', dst);
                imgMain.delete();
                dst.delete();
                contours.delete();
                hierarchy.delete();
            }, true);


            // -------- CANNY / EDGE -----
            let canny = document.getElementById('btn-canny');
            canny.addEventListener("click", (e) => {
                let imgMain = cv.imread("preview-image");
                let imgCanny = imgMain.clone();

                cv.Canny(imgMain, imgCanny, 50, 100);

                cv.imshow("main-canvas", imgCanny);
                imgCanny.delete();
                imgMain.delete();
            }, true);

            // ---------- GRAY ----------
            let gray = document.getElementById('btn-gray');
            gray.addEventListener("click", (e) => {
                let imgMain = cv.imread('preview-image');
                let imgGray = imgMain.clone();
                cv.cvtColor(imgMain, imgGray, cv.COLOR_RGBA2GRAY, 0);
                cv.imshow("main-canvas", imgGray);
                imgGray.delete();
                imgMain.delete();
            })


            // --------- BLUR --------
            let blur = document.getElementById('btn-blur');
            blur.addEventListener("click", (e) => {
                let imgMain = cv.imread('preview-image');
                let imgBlur = imgMain.clone();

                let ksize = new cv.Size(29, 29);
                cv.GaussianBlur(imgMain, imgBlur, ksize, 0);
                cv.imshow("main-canvas", imgBlur);
                imgBlur.delete();
                imgMain.delete();
            }, true);


            // ADDING BRIGHTNESS

            let brightness = document.getElementById('btn-brightness');
            brightness.addEventListener("click", (e) => {
                
                let img = cv.imread('preview-image');

                // Create a matrix representing the same size as the image
                let brightnessMatrix = new cv.Mat.zeros(img.rows, img.cols, img.type());

                // Define the brightness value
                let brightnessValue = 50;

                // Add the brightness value to the image
                cv.add(img, new cv.Mat(brightnessMatrix.rows, brightnessMatrix.cols, brightnessMatrix.type(), [brightnessValue, brightnessValue, brightnessValue, 0]), img);

                cv.imshow('main-canvas', img);

                brightnessMatrix.delete();
                img.delete();

            }, true);

            // UPLOADING THE IMAGE    
            reader.addEventListener('load', function () {
                previewImage.setAttribute('src', this.result);
            });

            let src, dst;
            if (file) {
                reader.readAsDataURL(file);
                alert('Now perform any operation given in the left side-bar :)');

                reader.onload = async (e) => {
                    src = cv.imread(new Uint8Array(e.target.result));
                    dst = new cv.Mat();
                    srcData = new Uint8Array(src.data);
                    dstData = new Uint8Array(dst.data);
                }

                // DOWNLOAD THE PROCESSED IMAGE

                const downloadLink = document.getElementById('download-link');
                const canvas = document.getElementById('main-canvas');

                downloadLink.addEventListener('click', function () {
                    // Convert the canvas content to a data URL (PNG format by default)
                    const dataURL = canvas.toDataURL();

                    if (dataURL == '') {
                        alert("please upload some image first")
                    }

                    // Create a temporary anchor element to trigger the download
                    const anchor = document.createElement('a');
                    anchor.href = dataURL;
                    anchor.download = "processed-image.png"; // default file name
                    anchor.style.display = 'none';
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                });

            }
        });
    }
}