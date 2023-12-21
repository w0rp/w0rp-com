---
title: Video and Audio Are Great Now!
date: 2023-02-14 08:14:00
tags: ["html5"]
---

I just wanted to write a mini post as a reminder about how great the world is now (in one respect), because [&lt;video&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) and [&lt;audio&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) work fantastically in web browsers these days. There was once a long and crazy battle between `.webm` and `.mp4`. It's a fascinating topic in of itself, but essentially every browser, mobile, and computer vendor was fighting a ding-dong battle about which formats should be used on the web. This meant that HTML5 video and audio just **didn't work** for years and years. I offer no citations because I'm lazy. Long story short, despite having [weird ass scary licencing](https://www.mpegla.com/programs/avc-h-264/), H.264 won as the video format.

Here is what you can use reliably in browsers today.

| format | container |
| - | - |
| [H.264/AVC](https://caniuse.com/?search=h264) | `<video src="foo.mp4">` |
| [AAC](https://caniuse.com/?search=aac) | `<video src="foo.mp4">`, `<audio src="foo.mp4">` |
| [MP3](https://caniuse.com/?search=mp3) | `<audio src="foo.mp3">` |
| [FLAC](https://caniuse.com/?search=flac) | `<audio src="foo.flac">` |

It just works!

{{< rawhtml >}}
<audio controls="controls" preload="auto" src="/media/itjustworks.mp3"></audio>
{{< /rawhtml >}}

Firefox will screw up if you upload AAC audio in `.aac` files, so just upload audio as `.mp4` if you want AAC, or use MP3 for audio only.

You will likely need to add `controls="controls"` to your tags, but you don't need `source` or nuffin, just use HTML5 elements today, and only opt for something like YouTube or an MP3 sharing website if you run out of bandwidth. Enjoy the modern web!
