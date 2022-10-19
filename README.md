# Youtube Overlay
Places a simple textarea overlay on YouTube videos so you can paste in chords/lyrics & jam out!

Video demo: https://v.redd.it/iqn37wemlas61 / https://www.reddit.com/r/webdev/comments/mnzrzc/i_made_a_chrome_extension_to_overlay_guitar/

-> When user clicks on the extension icon, `bg.js` runs, which in turn fires up `yt.js`. 

-> `yt.js` injects HTML elements (like buttons/etc) & CSS Rules (styling for the buttons/etc) into the DOM.

-> `yt.js` also injects `funcsTBInsertedIntoDOM.js` into DOM, which contains functions to make the aforeadded buttons/etc work.

-> `manifest.json` is the Chrome extension requisite. The extension doesn't use any special permissions except access to the `activeTab` & the `scripting` API.

-> `tsconfig.json` is just the instructions for the TypeScript compiler.

-> Somehow still need to figure out how NOT to run the extension when user clicks on the icon but URL != "https://www.youtube.com/watch?v*". Need to place this restriction in the Manifest somehow, not keen on a Javascript `if tab.url !=` check in `bg.js`.
