'use strict'

var rule = require('unified-lint-rule');
var generated = require('unist-util-generated');
var visit = require('unist-util-visit');

var urlRegex = /^https?:\/\/(?:osu|new)\.ppy\.sh\/(.+?)\/?$/;
var uriWarnings = [
    [/^b(?:eatmaps)?\/\d+$/, 'Beatmap URLs should use the /beatmapsets/{beatmapset-id}#{mode}/{beatmap-id} format'],
    [/^mp\/\d+$/, 'Multiplayer match URLs should use the /community/matches/{match-id} format'],
    [/^s\/\d+$/, 'Beatmapset URLs should use the /beatmapsets/{beatmapset-id} format'],
    [/^u\/\d+$/, 'User URLs should use the /users/{user-id} format'],
];

function osuLinks(tree, file) {
    visit(tree, 'link', visitor);

    function visitor(node) {
        if (generated(node))
            return;

        var uriMatch = node.url.match(urlRegex);

        if (uriMatch !== null)
            uriWarnings.forEach(function ([uriRegex, warning]) {
                if (uriRegex.test(uriMatch[1]))
                    file.message(warning, node);
            });
    }
}

module.exports = rule('remark-lint-osu:links', osuLinks);
