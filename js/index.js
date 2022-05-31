"use strict";

/**
 * initialize variables
 */
// Sections
const $previewResult = document.querySelector("#preview-result");
const $infoInitial = document.querySelector("#info-initial");
// Elements
const $textResult = $previewResult.querySelector("textarea[name=text-result]");
const $imgResult = $previewResult.querySelector("#preview-result #img-result");
const $iconStatus = document.querySelector(".navbar #icon-status");
const $statusProgress = $previewResult.querySelector("#status-progress");
// libraries
const reader = new FileReader();
let ocrWorker = null;

/**
 * methods
 */
const startOcrWorker = async () => {
  ocrWorker = new Tesseract.createWorker({
    logger: logOcrWorker,
  });

  await ocrWorker.load();
  await ocrWorker.loadLanguage("por");
  await ocrWorker.initialize("por");
};
const eventPaste = (ev) => {
  const item = (ev.clipboardData || ev.originalEvent.clipboardData).items[0];

  if (item.kind === "file") {
    reader.readAsDataURL(item.getAsFile());
  }
};
const convertImgToText = async (img) => {
  const { data } = await ocrWorker.recognize(img);
  return data.text;
};
const logOcrWorker = (log) => {
  if (log.status == "initialized api" && log.progress == 1) {
    $iconStatus.classList.remove("text-warning");
    $iconStatus.classList.add("text-success");
  }

  if (log.status == "recognizing text") {
    $statusProgress.hidden = false;
    $statusProgress.querySelector(".progress-bar").style.width =
      log.progress * 100 + "%";

    if (log.progress == 1) $statusProgress.hidden = true;
  }
};

/**
 * Events
 */
window.onload = async () => {
  startOcrWorker();
  document.addEventListener("paste", eventPaste);
};
reader.onload = async () => {
  $infoInitial.hidden = true;
  $previewResult.hidden = false;
  $imgResult.src = reader.result;

  $textResult.value = "";
  $textResult.value = await convertImgToText(reader.result);
};
