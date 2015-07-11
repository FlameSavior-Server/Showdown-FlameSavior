/* Music Box chat-plugin
 * parses links into the HTML for music boxes
 * by panpawn
 */

var https = require("https");

exports.commands = {
    musicbox: function (target, room, user) {
        if (!target) return this.sendReply("/musicbox link, link, link - parses it to be in a music box")
        this.sendReply(parse(target));
    }
};

function parse (link) {
    try {
        var id = link.substring(link.indexOf("=") + 1).replace(".","");
        var options = {
            host: 'www.googleapis.com',
            path: '/youtube/v3/videos?id=' + id + '&key=AIzaSyBHyOyjHSrOW5wiS5A55Ekx4df_qBp6hkQ&fields=items(snippet(channelId,title,categoryId))&part=snippet'
        };
        var callback = function(response) {
            var str = '';
            response.on('data', function(chunk) {
                str += chunk;
            });
            response.on('end', function() {
                title = str.substring(str.indexOf("title") + 9, str.indexOf("categoryId") - 8);
                
            });
        };
        https.request(options,callback).end();
        } catch (e) {}
        return '<a href="' + link + '"><button title="' + title + '">' + title + '</a></button><br />'; //parse it now
        title = ""; //buggy will work this out later
}