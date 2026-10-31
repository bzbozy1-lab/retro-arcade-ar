# Sakhr portal — editorial sources and integration

Reviewed 2026-10-31. Page: `sakhr.html`.

## Historical scope

- Founding date **1982** is explicitly the beginning of the Sakhr project, as stated by Mohamed Al-Sharekh in his interview with Al-Mujtama (1 February 2022), and consistent with the King Faisal Prize biography's record of Arabization work since 1982. This is not a release date for every Sakhr computer. Another family biography dates the company launch to 1983; the page deliberately identifies the project rather than collapsing these dates.
- Founder **Mohamed bin Abdulrahman Al-Sharekh (1942–6 March 2024)**, Kuwait; **2021 King Faisal Prize in Service to Islam**. Primary source: https://kingfaisalprize.org/ar/mohamed-bin-abdulrahman-al-sharekh/
- Interview and Nabil Ali's contribution: https://mugtama.com/archive/articles/محمد_الشارخ_مؤسس_شركة_صخر_لبرامج_الحاسب_الآلي_لـ_المجتمع_جمعنا_بين_الاهتمام_باللغة_كأصالة_والتقنية_كواقع_مستجد
- The broad historical-first description is **attributed** to the Kuwaiti National Council for Culture, Arts and Letters as reported by Al Jazeera; it is not an independent exhaustive chronology of all Arabic computing. https://www.aljazeera.net/misc/2024/3/6/وفاة-الكويتي-محمد-الشارخ-أول-من-أدخل
- Technical context reviewed: https://www.msx.org/wiki/Sakhr_AX-170 and https://direct.msx.org/wiki/Category%3ASakhr/Al_Alamiah . The supplied links are not evidence that these ten titles are exclusively for an “AX-160” model. The portal labels them Arabic MSX titles.

## Ten requested titles

Each launch is an HTTPS link to `https://www.file-hunter.com/Arabic/?id=ID`, in a separate tab with `rel="noopener noreferrer"`. All ten pages returned their expected title and `X-Frame-Options: SAMEORIGIN` during HTTP inspection. The portal does not embed these pages, proxy them, copy program images, strip framing restrictions, or load emulator code at startup. Source availability can change.

| ID | English title | Publisher listed by File-Hunter |
| --- | --- | --- |
| seahorse | Seahorse | Al Alamiah |
| sebaweh | Sebaweh | Al Alamiah |
| shaterhassan | Shater Hassan | Barq |
| skywolf | Sky Wolf | Barq |
| smallexplorer | Small Explorer / Young Researcher | Al Alamiah |
| spellright | Spell Right | Al Alamiah |
| testyouriq2 | Test Your IQ 2 | Al Alamiah |
| thinkwithme | Think With Me | Barq |
| treasure | Treasure | Barq |
| triptomekkah | Trip To Mekkah / Voyage To Mecca | Al Alamiah |

WebMSX project: https://github.com/ppeccin/WebMSX . Public source code for the emulator does not establish redistribution permission for each historical program. In-page playback is intentionally unavailable until a permitted embed or appropriately licensed software/media is available. No claim that all ten programs were fully played is made.

## Pending historical images

Three `<figure data-photo-slot>` elements: `founder`, `computer`, `archive`. Replace their placeholder contents with the user-supplied original photographs. Include meaningful Arabic alt text, caption, date and credit where supplied; retain explicit uncertainty for unknown dates. Do not generate a portrait or label a symbolic drawing as an archival photograph.

## Isolation

Existing magazine/reader files, shared emulator-independent runtimes, wishlist and achievement storage remain unchanged. Magazine navigation is intentionally left unchanged under the user's instruction to freeze that section; the other museum pages gain the new navigation link. Search is local DOM filtering, without network calls or preference writes. All ten cards and historical text are present without JavaScript.
