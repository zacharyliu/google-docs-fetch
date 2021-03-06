var cheerio = require('cheerio');
var css = require('css');
var request = require('request');
var url = require('url')

module.exports = function (docId, callback) {
  var docUrl = 'https://docs.google.com/document/export?format=html&id=' + docId;

  request(docUrl, function (error, response, body) {
    if (error)
      return callback(error);
    if (response.statusCode != 200)
      return callback('Error fetching doc (response status: ' + response.statusCode + ')');

    var $ = cheerio.load(body);
    var styles = $('head style').html();
    var stylesAst = css.parse(styles);

    // Content wrapper class
    var className = 'page-content-' + docId;

    // Process stylesheet
    stylesAst.stylesheet.rules.forEach(function (rule) {
        if (rule.type !== 'rule') return;

        // Wrap all selectors in .page-content class
        rule.selectors = rule.selectors.map(function (e) {
          return '.' + className + ' ' + e;
        });

        rule.declarations.forEach(function (declaration) {
            if (declaration.type !== 'declaration') return;

            // Remove font-family styles
            if (declaration.property === 'font-family')
                declaration.value = '';
        });
    });
    var parsedStyles = css.stringify(stylesAst);

    // Process body
    $('a').each(function () {
        var originalHref = $(this).attr('href');
        if (!originalHref) return;

        // Unwrap redirect URLs
        var parsedUrl = url.parse(originalHref, true);
        if (parsedUrl.hostname === 'www.google.com' &&
          parsedUrl.pathname === '/url' &&
          parsedUrl.query.q) {
            $(this).attr('href', parsedUrl.query.q);
        }
    });

    var parsedContent = '<style type="text/css">' + parsedStyles + '</style>' + 
      '<div class="' + className + '">' + $('body').html() + '</div>';

    callback(null, parsedContent);
  });
};
