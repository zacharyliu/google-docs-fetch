# google-docs-fetch
Fetch a Google Docs document as formatted, inlineable HTML.

* Preserves (inline) document formatting, including bold/italics, colors, and more
* Strips page width to reflow text into your own container
* Maintains original URLs and uploaded images

## Installation
`npm install google-docs-fetch`

## Usage
Ensure that your document has link sharing on and set to be viewable by "Anyone wth the link". Retrieve your document ID (shown here as `YOUR-DOC-ID`) from the generated link:

`https://docs.google.com/document/d/YOUR-DOC-ID/edit?usp=sharing`

In your script, you can then retrieve the contents of the document as HTML:

```js
var fetch = require('google-docs-fetch');

fetch('YOUR-DOC-ID', function (err, content) {
  if (!err) {
    console.log(content);
  }
});
```

The resulting HTML will resemble the following format, using a wrapper class to scope CSS styles:

```html
<style type="text/css">
.page-content-YOUR-DOC-ID ... {...}
</style>
<div class="page-content-YOUR-DOC-ID">
...
</div>
